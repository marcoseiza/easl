import React from "react";
import cm from 'codemirror';

import MdEditor from "./md-editor";

export const MdHeader: React.FC = () => {
  /* eslint-disable-next-line */
  const [options, _] = React.useState<cm.EditorConfiguration>({
    mode: 'markdown',
    theme: 'solarized dark',
    lineNumbers: false,
    lineWrapping: true
  });

  return (
    <MdEditor options={options} />
  );
}

export default MdHeader;