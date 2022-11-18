<template>
  <div>
    <div class="main-wrapper">
      <div class="main-top-title">
        <top-title
          :title="titleGameManagement"
          style="margin-bottom: 0"
        ></top-title>
      </div>
      <div v-if="summary().length != 0 && !nullPoint()" class="report-wrap">
        <div class="chart-wrap">
          <div class="backlog-name">
            {{ game.product_backlog.product_backlog_name }}
          </div>
          <div class="chart">
            <GameManagementChart
              :summary="summary()"
              :dataConvert="dataConvert"
              :colors="color"
            ></GameManagementChart>
            <div class="legends">
              <div
                class="item"
                v-for="(player, index) in dataConvert"
                :key="index"
              >
                <div class="first-line">
                  <div
                    class="round"
                    :style="{ background: [player.color] }"
                  ></div>
                  {{ player.pont }}
                </div>
                <div class="second-line">
                  {{ `${player.repeat}%(${player.name})` }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-wrap">
          <div class="backlog-name">Story voting completed</div>
          <div class="list">
            <div
              class="item-list"
              v-for="(player, index) in summary()"
              :key="index"
            >
              <div class="name-wrap">
                <div v-if="!avatarPlayers()[player.email]" class="icon">
                  {{ player.name[0] }}
                </div>
                <div class="v-avatar avatar" v-else>
                  <img :src="avatarPlayers()[player.email]" />
                </div>
                <div class="name">{{ player.name }}</div>
              </div>
              <div class="point">
                {{ player.story_point }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-data d-flex justify-center mt-10">
        <img
          class="icon-not-found"
          src="@/assets/images/icon-not-found.svg"
          alt=""
        />
        <div class="text-not-found">No data available</div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '@/socket/socket';
import event from '@/socket/event';
import localStorageUtil from '@/utils/utils_local_storage';
import jwt_decode from 'jwt-decode';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import actionTypes from '@/store/modules/game/action_types';
import getterTypes from '@/store/modules/game/getter_types';
import getterTypesUser from '@/store/modules/user/getter_types';
import projectActions from '@/store/modules/project/action_types';
import userActions from '../../store/modules/user/action_types';
import TopTitle from '@/components/TopTitle.vue';
import GameManagementChart from './GameManagementChart.vue';
import { colors } from '@/utils/utils_color_chart';
import mutationType from '@/store/app/mutation_types';
import jwtDecode from 'jwt-decode';
import localStorageUtils from '@/utils/utils_local_storage';
import MESSAGE from '@/utils/utils_message';

export default {
  components: {
    TopTitle,
    GameManagementChart,
  },
  data() {
    return {
      titleGameManagement: 'Game report',
      colors: colors
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
      project: {
        users: [],
      },
      allUser: [],
      dataConvert: [],
      currentUserId: '',
    };
  },
  watch: {
    allUser() {
      if (this.allUser) {
        this.summary();
      }
    },
  },
  computed: {
    ...mapGetters({
      game: getterTypes.GET_GAME_MANAGEMENT,
      getRole: getterTypesUser.GET_WITH_SYSTEM_ROLE,
    }),
    total() {
      return this.summary().reduce(
        (partialSum, player) =>
          partialSum + (player.story_point === null ? 0 : player.story_point),
        0
      );
    },
    color() {
      return this.summary().reduce((pre, cur) => {
        const key = cur.story_point;
        if (key in pre) {
          return pre;
        } else {
          return {
            ...pre,
            [key]: this.colors.shift(),
          };
        }
      }, {});
    },
  },

  methods: {
    ...mapActions({
      getUserList: userActions.ACT_GET_ALL,
      getGame: actionTypes.GET_GAME,
      getProject: projectActions.ACT_GET_PROJECT_BY_ID,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
    }),

    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    summary() {
      return this.game?.players
        .filter((item) => item.status || item.story_point !== null)
        ?.map((player) => {
          const playerFind = this.allUser?.find(
            (item) => item.email === player.email
          );
          const name = playerFind ? playerFind.name : player.email;
          return {
            ...player,
            name,
          };
        })
        .sort((a, b) => {
          return new Date(b.update_date) - new Date(a.update_date);
        });
    },

    summed() {
      return this.summary().reduce((pre, cur) => {
        const key = cur.story_point;
        const repeat =
          100 /
          this.summary().filter((e) => {
            return e.story_point != null;
          }).length;
        if (key in pre) {
          return {
            ...pre,
            [key]: {
              pont: cur.story_point,
              times: pre[key].times + 1,
              repeat:
                cur.story_point !== null
                  ? (repeat * (pre[key].times + 1)).toFixed(1)
                  : 0,
              name: pre[key].name + ', ' + cur.name,
              color: pre[key].color,
            },
          };
        } else {
          const newColor = colors.pop();
          colors.unshift(newColor);
          return {
            ...pre,
            [key]: {
              pont: cur.story_point,
              times: 1,
              repeat: cur.story_point !== null ? repeat.toFixed(1) : 0,
              name: cur.name,
              color: cur.story_point !== null ? newColor : 'rgb(0, 0, 0)',
            },
          };
        }
      }, {});
    },
    nullPoint() {
      return this.summary().every((e) => e.story_point === null);
    },
    avatarPlayers() {
      const array1 = this.summary();
      let intersection = {};
      array1.forEach((e) => {
        const item = this.allUser.find((y) => y.email === e.email);
        if (item) {
          intersection[e.email] = item.avatar;
          if (
            item.avatar ===
              'https://res.cloudinary.com/dvnchwzbe/image/upload/v1647422427/napa%20planning%20poker/avatar-account_v4r9ti.png' ||
            item.avatar === null
          )
            intersection[e.email] = null;
        } else {
          intersection[e.email] = null;
        }
      });
      return intersection;
    },
    getGameId() {
      if (this.$route.query.id) {
        return +this.$route.query.id;
      }
    },
    getCurrentEmail() {
      const token = jwt_decode(localStorageUtil.getToken());
      return token.email;
    },
  },
  async created() {
    const decodedToken = jwtDecode(localStorageUtils.getService().getToken());
    this.currentUserId = decodedToken.userId;
    const gameId = this.$route.query.id;
    await this.getGame({ id: this.getGameId(), email: this.getCurrentEmail() });
    this.project = await this.getProject({
      id: this.game.product_backlog.project_id,
    });
    await this.getUserWithSystemRole({ id: this.currentUserId });
    const check = this.game.product_backlog.project.users?.some(
      (item) => item.email === decodedToken.email
    );

    if (check === false && this.getRole.system_role_id !== 1) {
      this.setSnackBar({
        type: 'warning',
        visible: true,
        text: MESSAGE.NOT_MEMBER_IN_PROJECT,
      });
      this.$router.push({
        name: 'project-list',
        query: {
          page: 1,
          size: 12,
        },
      });
      return;
    }

    this.allUser = await this.getUserList({
      keyword: this.keySearch,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });

    this.summed();
    this.avatarPlayers();
    this.dataConvert = Object.values(this.summed());
    socket.checkUpdateNameBacklogList(async () => {
      await this.getGame({ id: gameId });
    });
  },
  async mounted() {
    socket.onDeleteBacklog(async () => {
      try {
        await this.getGame({
          id: this.getGameId(),
          email: this.getCurrentEmail(),
        });
      } catch (error) {
        this.$router.replace({
          name: 'backlog-list',
          query: {
            projectId: this.game.product_backlog.project_id,
            pageIndex: 1,
          },
        });
        this.setSnackbar({
          type: 'error',
          visible: true,
          text: MESSAGE.BACKLOG_NOT_EXISTED,
        });
      }
    });

    socket.ondeleteProject(async () => {
      try {
        await this.getGame({
          id: this.getGameId(),
          email: this.getCurrentEmail(),
        });
      } catch (error) {
        this.$router.push({ name: 'project-list' });
        this.setSnackbar({
          type: 'error',
          visible: true,
          text: MESSAGE.PROJECT_NOT_EXISTED,
        });
      }
    });
    socket.getInstance().on(event.SOMEONE_SUBMIT, async () => {
      await this.getGame({
        id: this.getGameId(),
        email: this.getCurrentEmail(),
      });
      this.dataConvert = Object.values(this.summed());
    });
    socket.getInstance().on(event.SOMEONE_OFF_GAME, async () => {
      await this.getGame({
        id: this.getGameId(),
        email: this.getCurrentEmail(),
      });
      this.dataConvert = Object.values(this.summed());
    });
    socket.getInstance().on(event.SOMEONE_JOIN_GAME, async () => {
      await this.getGame({
        id: this.getGameId(),
        email: this.getCurrentEmail(),
      });
      this.dataConvert = Object.values(this.summed());
    });
  },
};
</script>

<style lang="scss" scoped>
.second-line {
  line-height: 1.2;
}
.avatar {
  width: 35px;
  height: 35px;
  border-radius: 35px;
  margin-right: 18px;
  box-shadow: 0px 3px 6px #3597e273;
  img {
    width: 100%;
  }
}
.main-wrapper {
  background-color: #f4f6fa;
  height: 100%;
  .main-top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    /* margin-bottom: 16px; */
    .button-container {
      .button-container-button {
        display: flex;
        gap: 15px;
      }
    }
  }
  .report-wrap {
    margin-top: 36px;
    display: flex;
    gap: 24px;
    width: 100%;
    height: 90%;
    & > div {
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 3px 6px #00000029;
      border-radius: 20px;
      padding: 30px 25px;

      .backlog-name {
        text-align: left;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 0px;
        color: #000000;
        margin-bottom: 30px;
      }
    }

    .chart-wrap {
      width: 58%;

      .chart {
        display: flex;

        .legends {
          max-height: 650px;
          overflow: auto;
          overflow-x: hidden;
          width: -webkit-fill-available;
          &::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: #f5f5f5;
          }

          &::-webkit-scrollbar {
            width: 2px;
            height: 4px;
            background-color: #f5f5f5;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: rgb(196, 193, 193);
          }

          .item {
            font-size: 20px;
            letter-spacing: 0px;
            color: #000000;
            line-height: 20px;
            margin-bottom: 29px;

            .first-line {
              display: flex;
              align-items: center;
              font-weight: bold;
              margin-bottom: 9px;
              .round {
                content: '';
                width: 20px;
                height: 20px;
                border-radius: 20px;
                background: red;
                margin-right: 9px;
              }
            }
          }
        }
      }
    }
    .list-wrap {
      width: calc(42% - 24px);

      .backlog-name {
        margin-bottom: 15px;
      }

      .list {
        height: 100%;
        max-height: 650px;
        overflow: auto;

        &::-webkit-scrollbar-track {
          border-radius: 10px;
          background-color: #f5f5f5;
        }

        &::-webkit-scrollbar {
          width: 2px;
          height: 4px;
          background-color: #f5f5f5;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: rgb(196, 193, 193);
        }

        .item-list {
          padding: 15px 20px;
          border-bottom: solid 1px #00000029;
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 100%;

          .name-wrap {
            display: flex;
            align-items: center;

            .icon {
              width: 35px;
              height: 35px;
              border-radius: 35px;
              text-transform: uppercase;
              font-size: 16px;
              font-weight: bold;

              background: #ffffff 0% 0% no-repeat padding-box;
              box-shadow: 0px 3px 6px #3597e273;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 18px;
            }
            .name {
              font-size: 20px;
              width: auto;
              font-weight: normal;
            }
          }
          .point {
            width: 20px;
            font-size: 20px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .report-wrap {
    flex-direction: column;

    .chart-wrap {
      width: 100% !important;
      .chart {
        flex-direction: column;
      }
      .legends {
        height: 200px;
      }
    }

    .list-wrap {
      width: 100% !important;
      height: 561px !important;
      .list {
        height: 455px !important;
        max-height: 455px !important;
        overflow-x: hidden !important;
      }
    }
  }
}
@media (max-width: 520px) {
  .name {
    max-width: 175px;
    overflow-wrap: break-word;
  }
}
</style>
