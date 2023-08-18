import { Language } from '@renderer/views/Analyze';
import React from 'react';

interface LanguageSelectionProps {
    languages: Language[];
    selectLanguage: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    language: Language;
  }
  

function LanguageSelection({
  languages,
  selectLanguage,
  language,
}: LanguageSelectionProps): JSX.Element {
  return (
    <div>
      <select
        className='bg-slate-600'
        id="languageSelect"
        onChange={selectLanguage}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelection;
