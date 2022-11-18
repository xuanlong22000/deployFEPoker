import ROLE from '@/utils/utils_role.js';

const user = {
  ADMIN: {
    userId: 0,
    email: 'admin@gmail.com',
  },
  PM: {
    userId: 1,
    email: 'pm@gmail.com',
  },
  MEMBER: {
    userId: 2,
    email: 'member@gmail.com',
  },
};
const projectDetail = [
  // IC_00: !lastGame - currentUserRole of backlog: Admin
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.ADMIN,
        lastGame: null,
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_01: !lastGame - currentUserRole of backlog: Project Manager
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.PM,
        lastGame: null,
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_02: !lastGame - currentUserRole of backlog: Backlog Owner
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 2,
        createDate: '06/12/2021',
        currentUserRole: ROLE.BO,
        lastGame: null,
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_03: !lastGame - currentUserRole of backlog: Member
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.MEMBER,
        lastGame: null,
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_04: !startGame - currentUserRole of backlog: Admin
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.ADMIN,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: null,
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_05: !startGame - currentUserRole of backlog: Project Manager
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.PM,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: null,
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_06: !startGame - currentUserRole of backlog: Backlog Owner
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.BO,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: null,
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_07: !startGame - currentUserRole of backlog: Member
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole:ROLE.MEMBER,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: null,
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_08: !endGame - currentUserRole of backlog: Admin
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.ADMIN,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_09: !endGame - currentUserRole of backlog: Project Manager
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.PM,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_10: !endGame - currentUserRole of backlog: Backlog Owner
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.BO,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_11: !endGame - currentUserRole of backlog: Member
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.MEMBER,
        lastGame: {
          createDate: '07/12/2021',
          endGame: null,
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_12: endGame - currentUserRole of backlog: Admin
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.ADMIN,
        lastGame: {
          createDate: '07/12/2021',
          endGame: '2021-13-06T16:28:56.000Z',
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_13: endGame - currentUserRole of backlog: Project Manager
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.PM,
        lastGame: {
          createDate: '07/12/2021',
          endGame: '2021-13-06T16:28:56.000Z',
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_14: endGame - currentUserRole of backlog: Backlog Owner
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.BO,
        lastGame: {
          createDate: '07/12/2021',
          endGame: '2021-13-06T16:28:56.000Z',
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_15: endGame - currentUserRole of backlog: Member
  {
    backlogList: [
      {
        average: 0,
        backlogId: 1,
        backlogName: '1',
        backlogOwnerId: 1,
        createDate: '06/12/2021',
        currentUserRole: ROLE.MEMBER,
        lastGame: {
          createDate: '07/12/2021',
          endGame: '2021-13-06T16:28:56.000Z',
          gameId: 54,
          ownerGameId: 1,
          startGame: '2021-12-06T16:28:56.000Z',
          updateDate: '07/12/2021',
        },
      },
    ],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
  // IC_16: length of backlogList = 0
  {
    backlogList: [],
    backlogQuantity: 1,
    project: {
      id: '1',
      name: 'EZ-Team',
      pmId: 1,
    },
  },
];
// Input case for props
const props = {
  backlog: [
    // IC_00: Create game button
    {
      average: 0,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'Create Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: null,
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_01: Join game button
    {
      average: 0,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: null,
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_02: View game button
    {
      average: 0,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: null,
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_03: projectId
    {
      projectId: 1,
    },
    // IC_04: pageIndex
    {
      pageIndex: 1,
    },
  ],
};

// Input case for event
const event = {
  backlog: [
    // IC_00: !lastGame, role ADMIN
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'Create Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.ADMIN,
      lastGame: null,
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_01: !lastGame, role PM
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 1,
      button: { buttonType: 'Create Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: null,
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_02: !lastGame, role MEMBER
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 1,
      button: { buttonType: 'Join Game', buttonStatus: false },
      createDate: '16/11/2021',
      currentUserRole: ROLE.MEMBER,
      lastGame: null,
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_03: !lastGame, role MEMBER, backlogOwner
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 1,
      button: { buttonType: 'Create Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.BO,
      lastGame: null,
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_04: lastGame, !startGame, role ADMIN, not GO
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.ADMIN,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 3,
        startGame: null,
        updateDate: '07/12/2021',
      },
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_05: lastGame, !startGame, role ADMIN, GO
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 3,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.ADMIN,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 0,
        startGame: null,
        updateDate: '07/12/2021',
      },
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_06: lastGame, !startGame, role PM, not GO
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 3,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 3,
        startGame: null,
        updateDate: '07/12/2021',
      },
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_07: lastGame, !startGame, role PM, GO
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 3,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 1,
        startGame: null,
        updateDate: '07/12/2021',
      },
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },

    // IC_08: lastGame, !startGame, role MEMBER, not BO
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 3,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.MEMBER,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 3,
        startGame: null,
        updateDate: '07/12/2021',
      },
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_09: lastGame, !startGame, role MEMBER, BO, not GO
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.BO,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 3,
        startGame: null,
        updateDate: '07/12/2021',
      },
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_10: lastGame, !startGame, role MEMBER, BO, GO
    {
      average: 0,
      backlogId: 1,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'Join Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.MEMBER,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 2,
        startGame: null,
        updateDate: '07/12/2021',
      },
      members: 0,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },

    // IC_11: lastGame, startGame, !endGame, role AdMIN, members 5
    {
      average: 0,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.ADMIN,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 2,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_12: lastGame, startGame, !endGame, role PM, members 5
    {
      average: 0,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 2,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_13: lastGame, startGame, !endGame, role MEMBER, members 5
    {
      average: 0,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 3,
      button: { buttonType: 'Join Game', buttonStatus: false },
      createDate: '16/11/2021',
      currentUserRole: ROLE.MEMBER,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 3,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_14: lastGame, startGame, !endGame, role MEMBER, backlogOwner, members 5
    {
      average: 0,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.MEMBER,
      lastGame: {
        createDate: '07/12/2021',
        endGame: null,
        gameId: 1,
        ownerGameId: 2,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_15: lastGame, startGame, endGame, role AdMIN, member 5, average 5
    {
      average: 5,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.ADMIN,
      lastGame: {
        createDate: '07/12/2021',
        endGame: '2021-12-08T16:28:56.000Z',
        gameId: 1,
        ownerGameId: 2,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_16: lastGame, startGame, endGame, role PM, member 5, average 5
    {
      average: 5,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.PM,
      lastGame: {
        createDate: '07/12/2021',
        endGame: '2021-12-08T16:28:56.000Z',
        gameId: 1,
        ownerGameId: 2,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_17: lastGame, startGame, endGame, role MEMBER, member 5, average 5
    {
      average: 5,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.MEMBER,
      lastGame: {
        createDate: '07/12/2021',
        endGame: '2021-12-08T16:28:56.000Z',
        gameId: 1,
        ownerGameId: 2,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
    // IC_18: lastGame, startGame, endGame, role MEMBER, backlogOwner, member 5, average 5
    {
      average: 5,
      backlogId: 2,
      backlogName: 'Create Mockup',
      backlogOwnerId: 2,
      button: { buttonType: 'View Game', buttonStatus: true },
      createDate: '16/11/2021',
      currentUserRole: ROLE.BO,
      lastGame: {
        createDate: '07/12/2021',
        endGame: '2021-12-08T16:28:56.000Z',
        gameId: 1,
        ownerGameId: 2,
        startGame: '2021-12-07T16:28:56.000Z',
        updateDate: '07/12/2021',
      },
      members: 5,
      pageIndex: 1,
      pageSize: 10,
      projectId: '1',
    },
  ],
  game: [
    {
      game_id: 1,
      start_game: '2021-12-06 16:28:56',
      end_game: '2021-12-06 16:28:56',
      create_date: '2021-12-06 16:28:56',
      update_date: '2021-12-06 16:28:56',
      product_backlog_id: 1,
      user_id: 1,
    },
  ],
};

export default { props, event, user, projectDetail };
