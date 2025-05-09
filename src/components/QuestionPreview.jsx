// src/components/QuestionPreview.jsx
import React from 'react';
import {
  OpenAnswerPreview,
  NumericAnswerPreview,
  SingleChoicePreview,
  MultipleChoicePreview,
  TrueFalsePreview,
  DatePreview
} from './QuestionPreviewComponents';

const QuestionPreview = ({ typeId }) => {
  switch (typeId) {
    case 1: return <OpenAnswerPreview />;
    case 2: return <NumericAnswerPreview />;
    case 3: return <SingleChoicePreview />;
    case 4: return <MultipleChoicePreview />;
    case 5: return <TrueFalsePreview />;
    case 6: return <DatePreview />;
    default: return null;
  }
};

export default QuestionPreview;
