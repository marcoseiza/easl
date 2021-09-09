import * as React from 'react';

import { alpha, Theme, withStyles } from '@material-ui/core/styles';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import { SvgIconProps, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useTreeItemStyles = (theme: Theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '& *': {
      boxSizing: "border-box",
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: alpha(theme.palette.action.focus, 0.5),

    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent !important',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightRegular,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.action.hover, theme.palette.action.hoverOpacity),
    },
  },
  group: {
    marginLeft: theme.spacing(2),
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
    textDecoration: 'none',
  },
  labelRootLink: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
});

export interface IconTreeItemProps extends Omit<TreeItemProps, "label" | "classes"> {
  labelIcon?: React.ElementType<SvgIconProps>;
  labelText: string;
  href?: string;
  classes?: any;
  onClick?: (e: any) => void;
}

export interface IconTreeItemState {
  children: React.ReactNode;
}

class IconTreeItem_ extends React.Component<IconTreeItemProps, IconTreeItemState> {
  constructor(props: IconTreeItemProps) {
    super(props);

    this.state = {
      children: props.children,
    }
  }

  render() {
    const {
      labelText,
      labelIcon: LabelIcon,
      href,
      onClick,
      classes,
      ...other
    } = this.props;

    const inside = (
      <>
        {LabelIcon && <LabelIcon color="inherit" className={classes?.labelIcon} fontSize="small" />}
        <Typography variant="body2" className={classes?.labelText}>
          {labelText}
        </Typography>
      </>
    )

    return (
      <TreeItem
        label={
          href ?
            <Link to={href} className={classes?.labelRootLink} children={inside} />
            :
            <div className={classes?.labelRoot} children={inside} />
        }
        classes={{
          root: classes?.root,
          content: classes?.content,
          expanded: classes?.expanded,
          selected: classes?.selected,
          group: classes?.group,
          label: classes?.label,
        }}
        onClick={onClick?.bind(this)}
        children={this.state.children}
        {...other}
      />
    )
  }
}

export default withStyles(useTreeItemStyles as any, { withTheme: true })(IconTreeItem_);