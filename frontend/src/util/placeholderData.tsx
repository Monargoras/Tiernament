import { MatchUpType, TiernamentRunEntryType, TiernamentType } from './types';

export const placeholderTiernament: TiernamentType = {
  tiernamentId: '1',
  authorId: '1',
  name: 'Placeholder Tiernament',
  description: 'Placeholder Tiernament Description',
  date: new Date(),
  entries: [
    {
      entryId: '1',
      name: 'Fop',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '2',
      name: 'Dt',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '3',
      name: 'Mathe 1',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '4',
      name: 'Mathe 2',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '5',
      name: 'Ro',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '6',
      name: 'Afe',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '7',
      name: 'Apl',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '8',
      name: 'Aud',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '9',
      name: 'Moses',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '10',
      name: 'Eicb',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '11',
      name: 'Se',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '12',
      name: 'Spp',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '13',
      name: 'Aer',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '14',
      name: 'Css',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '15',
      name: 'Infman',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '16',
      name: 'Cer',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '17',
      name: 'Cnuvs',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '18',
      name: 'Mathe 3',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '19',
      name: 'Fmise',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '20',
      name: 'Bp',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '21',
      name: 'Bs',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '22',
      name: 'Vc',
      imageLink: '',
      placementHistory: [],
    }
  ]
}

export const placeholderEntryA: TiernamentRunEntryType = {
  entryId: '1',
  name: 'Fop',
  imageLink: '',
  placementHistory: [],
  eliminated: false,
  winsStage1: 3,
  winsStage2: undefined,
  lossesStage1: 0,
  lossesStage2: undefined,

}

export const placeholderEntryB: TiernamentRunEntryType = {
  entryId: '2',
  name: 'Dt',
  imageLink: '',
  placementHistory: [],
  eliminated: false,
  winsStage1: 3,
  winsStage2: undefined,
  lossesStage1: 2,
  lossesStage2: undefined,
}

export const placeholderMatchUpWinner: MatchUpType = {
  matchUpId: '1',
  entryAId: '1',
  entryBId: '2',
  winner: 'A',
}

export const placeholderMatchUpNoWinner: MatchUpType = {
  matchUpId: '1',
  entryAId: '1',
  entryBId: '2',
  winner: undefined,
}