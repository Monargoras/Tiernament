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
  tiernamentPlayoffMatchUp: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    padding: '10px',
    minWidth: '100px',
    minHeight: '50px',
    elevation: 4,
    boxShadow: '0px 0px 0px 1px #ffffff',
  },
  tiernamentSwissMatchUp: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    boxShadow: '0px 0px 0px 1px #454545',
  },
}