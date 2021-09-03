import React from "react";
import MdEditor from "./md-editor";

export interface Props {

}

export interface State {
  options: object;
}


class MdHeader extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      options: {
        mode: 'markdown',
        theme: '3024-day',
        lineNumbers: false,
        lineWrapping: true
      }
    };
  }

  render() {
    return (
      <MdEditor options={this.state.options} />
    );
  }
}

export default MdHeader;