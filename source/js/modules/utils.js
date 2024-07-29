const WORD_FORMS = {
  'товар': ['товар', 'товара', 'товаров'],
};

const getWordForm = (qty, word) => {
  if (!WORD_FORMS[word]) {
    return word;
  }

  if (qty % 100 < 11 || qty % 100 > 14) {
    if (qty % 10 === 1) {
      return `${qty} ${WORD_FORMS[word][0]}`;
    } else if (qty % 10 > 1 && qty % 10 < 5) {
      return `${qty} ${WORD_FORMS[word][1]}`;
    }
  }

  return `${qty} ${WORD_FORMS[word][2]}`;
};

export { getWordForm };
