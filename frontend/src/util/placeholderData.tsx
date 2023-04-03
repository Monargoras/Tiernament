import { MatchUpType, TiernamentRunEntryType, TiernamentType } from './types';

export const placeholderTiernament: TiernamentType = {
  tiernamentId: '1',
  authorId: '1',
  name: 'Placeholder Tiernament',
  imageId: '',
  description: 'Placeholder Tiernament Description',
  date: new Date(),
  entries: [
    {
      entryId: '1',
      name: 'Fop',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '2',
      name: 'Dt',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '3',
      name: 'Mathe 1',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '4',
      name: 'Mathe 2',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '5',
      name: 'Ro',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '6',
      name: 'Afe',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '7',
      name: 'Apl',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '8',
      name: 'Aud',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '9',
      name: 'Moses',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '10',
      name: 'Eicb',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '11',
      name: 'Se',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '12',
      name: 'Spp',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '13',
      name: 'Aer',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '14',
      name: 'Css',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '15',
      name: 'Infman',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '16',
      name: 'Cer',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '17',
      name: 'Cnuvs',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '18',
      name: 'Mathe 3',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '19',
      name: 'Fmise',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '20',
      name: 'Bp',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '21',
      name: 'Bs',
      imageId: '',
      placementHistory: [],
    },
    {
      entryId: '22',
      name: 'Vc',
      imageId: '',
      placementHistory: [],
    }
  ]
}

export const placeholderEntryA: TiernamentRunEntryType = {
  entryId: '1',
  name: 'Fop',
  imageId: '6420a1009ba3c9781a7879c8',
  matchHistoryStage1: [],
  matchHistoryStage2: undefined,
  eliminated: false,
  advanced: false,
  winsStage1: 3,
  winsStage2: undefined,
  lossesStage1: 0,
  lossesStage2: undefined,

}

export const placeholderEntryB: TiernamentRunEntryType = {
  entryId: '2',
  name: 'Dt',
  imageId: '6420a380b0cf975d69a1b845',
  matchHistoryStage1: [],
  matchHistoryStage2: undefined,
  eliminated: false,
  advanced: false,
  winsStage1: 3,
  winsStage2: undefined,
  lossesStage1: 2,
  lossesStage2: undefined,
}

export const placeholderMatchUpWinner: MatchUpType = {
  matchUpId: '1',
  stage: 'stage1',
  round: 1,
  bracket: 'middle',
  entryAId: '1',
  entryBId: '2',
  winner: 'A',
}

export const placeholderMatchUpNoWinner: MatchUpType = {
  matchUpId: '1',
  stage: 'stage1',
  round: 1,
  bracket: 'middle',
  entryAId: '1',
  entryBId: '2',
  winner: undefined,
}