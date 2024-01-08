import { Fragment, DOMParser } from 'prosemirror-model';

function getHeading(schema) {
  const { paragraph, table_row, table_cell } = schema.nodes;
  const para = paragraph.create(null, schema.text('columns'));
  return table_row.create(null, Fragment.from(table_cell.create({ colspan: 2 }, para)));
}

function getContent(schema) {
  const cell = schema.nodes.table_cell.createAndFill();
  return schema.nodes.table_row.create(null, Fragment.fromArray([cell, cell]));
}

function getPara(schema) {
  const fragment = document.createDocumentFragment();
  fragment.append(document.createElement('p'));
  return DOMParser.fromSchema(schema).parse(fragment);
}

export default function insertTable(state, dispatch) {
  const heading = getHeading(state.schema);
  const content = getContent(state.schema);
  const para = getPara(state.schema);
  const node = state.schema.nodes.table.create(null, Fragment.fromArray([heading, content]));

  if (dispatch) {
    const trx = state.tr.insert(state.selection.head, para);
    trx.replaceSelectionWith(node).scrollIntoView();
    dispatch(trx);
  }
  return true;
}
