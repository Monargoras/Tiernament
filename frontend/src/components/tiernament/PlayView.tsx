import React from 'react';
import PlayOffDiagram from './PlayOffDiagram';
import { Accordion, AccordionDetails, AccordionSummary, Box, styled, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SwissMatchUp from './SwissMatchUp';
import {
  placeholderEntryA,
  placeholderEntryB,
  placeholderMatchUpNoWinner,
  placeholderMatchUpWinner
} from "../../util/placeholderData";

const CustomAccordion = styled(Accordion)(() => {
  return {
    '& .MuiAccordionSummary-root:hover, .MuiButtonBase-root:hover': {
      cursor: 'default',
    },
  }
})

export default function PlayView() {

  const { t } = useTranslation()

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="stage1-content"
          id="stage1-header"
        >
          <Typography>{t('stage1')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SwissMatchUp matchUp={placeholderMatchUpWinner} entryA={placeholderEntryB} entryB={placeholderEntryA} />
          <SwissMatchUp matchUp={placeholderMatchUpNoWinner} entryA={placeholderEntryA} entryB={placeholderEntryB} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="stage2-content"
          id="stage2-header"
        >
          <Typography>{t('stage2')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <CustomAccordion defaultExpanded expanded={true} onChange={() => {}}>
        <AccordionSummary
          aria-controls="playoffs-content"
          id="playoffs-header"
        >
          <Typography>{t('playoffs')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PlayOffDiagram />
        </AccordionDetails>
      </CustomAccordion>
    </Box>
  )
}