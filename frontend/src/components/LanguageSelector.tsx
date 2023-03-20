import React from 'react';
import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../index';

export default function LanguageSelector() {

  const { t, i18n } = useTranslation()

  const languages: readonly string[] = i18n.options.supportedLngs ? i18n.options.supportedLngs.slice(0, i18n.options.supportedLngs.length - 1) : []

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value).then(() => {})
  }

  return (
    <Box>
      <FormControl>
        <Select
          sx={{ color: theme.palette.primary.contrastText }}
          value={i18n.language.substring(0,2)}
          onChange={handleChange}
          variant={'standard'}
        >
          {
            languages.map((lang: string) => <MenuItem key={lang} value={lang}>{t('lang_' + lang)}</MenuItem>)
          }
        </Select>
      </FormControl>
    </Box>
  )
}