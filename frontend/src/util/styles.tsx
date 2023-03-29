export const utils = {
  topBottomMargin: {
    marginTop: 1,
    marginBottom: 1,
  },
}

export const generalStyles = {
  backgroundContainer: {
    minHeight: '90vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
  },
  textField: {
    ...utils.topBottomMargin,
  },
  paper: {
    padding: 8,
    margin: 'auto',
  },
  button: {
    ...utils.topBottomMargin,
  },
  flexWrapBox: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
  },
  snackbarAlert: {
    width: '100%',
    border: 1,
    borderColor: '#9e9e9e'
  },
  tiernamentPlayoffColumn: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    height: '70dvh',
  },
  tiernamentMatchUp: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    padding: '10px',
    minWidth: '100px',
    minHeight: '50px'
  }
}