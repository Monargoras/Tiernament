import React from 'react'
import { Backdrop, Box, Fade, Modal, Typography, useTheme } from '@mui/material';
import { getImageLink } from '../../apiRequests/imageRequests';
import { TiernamentRunEntryType } from '../../util/types';
import CustomAvatar from '../general/CustomAvatar';
import type { Container, Engine } from 'tsparticles-engine';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

interface WinnerModalProps {
  showModal: boolean,
  handleCloseModal: () => void,
  winner: TiernamentRunEntryType,
}

export default function WinnerModal(props: WinnerModalProps) {

  const theme = useTheme()

  const styles = {
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'background.paper',
      border: '2px solid #000',
      borderColor: theme.palette.primary.main,
      borderRadius: '5px',
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    modalEntry: {
      marginTop: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      minWidth: 300,
      borderStyle: 'solid',
      borderColor: theme.palette.tertiary.main,
      borderWidth: '2px',
      borderRadius: '5px',
      padding: '5px',
    },
  }

  const particlesInit = React.useCallback(async (engine: Engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = React.useCallback(async (container: Container | undefined) => {
    await console.log(container);
  }, []);

  return (
    <Box>
      <Modal
        open={props.showModal}
        onClose={props.handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={props.showModal}>
          <Box sx={styles.modal}>
            <CustomAvatar userName={'Winner'} imageId={'/tiernamentIcon.png'} dummy size={{height: 100, width: 100}} />
            <Box sx={styles.modalEntry}>
              <Typography variant={'h5'} flexWrap={'wrap'} maxWidth={400}>
                {props.winner.name}
              </Typography>
              {
                props.winner.imageId &&
                  <Box
                      component={'img'}
                      src={getImageLink(props.winner.imageId)}
                      alt={props.winner.name}
                      sx={{
                        maxWidth: 400,
                        height: 250,
                      }}
                  />
              }
            </Box>
          </Box>
        </Fade>
      </Modal>
      {
        props.showModal &&
          <Particles
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              fpsLimit: 120,
              fullScreen: {
                zIndex: 1
              },
              particles: {
                number: {
                  value: 0
                },
                color: {
                  value: [
                    "#00FFFC",
                    "#FC00FF",
                    "#fffc00"
                  ]
                },
                shape: {
                  type: [
                    "circle",
                    "square",
                    "triangle"
                  ],
                  options: {}
                },
                opacity: {
                  value: 1,
                  animation: {
                    enable: true,
                    minimumValue: 0,
                    speed: 2,
                    startValue: "max",
                    destroy: "min"
                  }
                },
                size: {
                  value: 4,
                  random: {
                    enable: true,
                    minimumValue: 2
                  }
                },
                links: {
                  enable: false
                },
                life: {
                  duration: {
                    sync: true,
                    value: 5
                  },
                  count: 1
                },
                move: {
                  enable: true,
                  gravity: {
                    enable: true,
                    acceleration: 10
                  },
                  speed: {
                    min: 10,
                    max: 20
                  },
                  decay: 0.1,
                  direction: "none",
                  straight: false,
                  outModes: {
                    default: "destroy",
                    top: "none"
                  }
                },
                rotate: {
                  value: {
                    min: 0,
                    max: 360
                  },
                  direction: "random",
                  move: true,
                  animation: {
                    enable: true,
                    speed: 60
                  }
                },
                tilt: {
                  direction: "random",
                  enable: true,
                  move: true,
                  value: {
                    min: 0,
                    max: 360
                  },
                  animation: {
                    enable: true,
                    speed: 60
                  }
                },
                roll: {
                  darken: {
                    enable: true,
                    value: 25
                  },
                  enable: true,
                  speed: {
                    min: 15,
                    max: 25
                  }
                },
                wobble: {
                  distance: 30,
                  enable: true,
                  move: true,
                  speed: {
                    min: -15,
                    max: 15
                  }
                }
              },
              emitters: {
                life: {
                  count: 0,
                  duration: 0.1,
                  delay: 0.4
                },
                rate: {
                  delay: 0.1,
                  quantity: 150
                },
                size: {
                  width: 0,
                  height: 0
                }
              }
            }}
          />
      }
    </Box>
  )
}