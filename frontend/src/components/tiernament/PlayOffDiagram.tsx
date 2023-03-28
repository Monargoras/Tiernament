import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { generalStyles } from '../../util/styles';
import Xarrow from 'react-xarrows';

export default function PlayOffDiagram() {

  const quarterFinals = ['quarter1', 'quarter2', 'quarter3', 'quarter4']
  const semiFinals = ['semi1', 'semi2']

  return (
    <Grid container>
      <Grid item xs={4} id={'quarter-final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        {
          quarterFinals.map((entry) => (
            <Box key={entry}>
              <Box id={entry}
                   sx={{display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center',
                     border: 'solid', borderColor: '#ff0000', borderWidth: '2px', width: '100px', height: '50px'}}
              >
                <Typography>{entry}</Typography>
              </Box>
            </Box>
          ))
        }
      </Grid>
      <Grid item xs={4} id={'semi-final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        {
          semiFinals.map((entry) => (
            <Box key={entry}>
              <Box id={entry}
                   sx={{
                     display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center',
                     border: 'solid', borderColor: '#ff0000', borderWidth: '2px', width: '100px', height: '50px'
                   }}
              >
                <Typography>{entry}</Typography>
              </Box>
              <Xarrow
                start={'quarter1'}
                end={'semi1'}
                color={'red'}
                showHead={false}
                showTail={false}
                strokeWidth={2}
                path={'grid'}
                dashness={true}
              />
              <Xarrow
                start={'quarter2'}
                end={'semi1'}
                color={'red'}
                showHead={false}
                showTail={false}
                strokeWidth={2}
                path={'grid'}
                dashness={true}
              />
              <Xarrow
                start={'quarter3'}
                end={'semi2'}
                color={'red'}
                showHead={false}
                showTail={false}
                strokeWidth={2}
                path={'grid'}
                dashness={true}
              />
              <Xarrow
                start={'quarter4'}
                end={'semi2'}
                color={'red'}
                showHead={false}
                showTail={false}
                strokeWidth={2}
                path={'grid'}
                dashness={true}
              />
            </Box>
          ))
        }
      </Grid>
      <Grid item xs={4} id={'final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        <Box id={'final'}
             sx={{
               display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center',
               border: 'solid', borderColor: '#ff0000', borderWidth: '2px', width: '100px', height: '50px'
             }}
        >
          <Typography>{'final'}</Typography>
        </Box>
        <Xarrow
          start={'semi1'}
          end={'final'}
          color={'red'}
          showHead={false}
          showTail={false}
          strokeWidth={2}
          path={'grid'}
          dashness={true}
        />
        <Xarrow
          start={'semi2'}
          end={'final'}
          color={'red'}
          showHead={false}
          showTail={false}
          strokeWidth={2}
          path={'grid'}
          dashness={true}
        />
      </Grid>
    </Grid>
  )
}