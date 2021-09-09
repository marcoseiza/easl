import * as React from 'react';

import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';

import { TreeItemInfo as FileTreeItemInfo, TreeItemInfo } from '..';
import IconTreeItem from './icon-tree-item';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.dark,
      height: '100%',
      flexGrow: 1,
      maxWidth: 2000,
      '&:hover .MuiTreeItem-group': {
        borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        marginLeft: (theme.spacing(2) - 1),
      }
    },
  })
);

export interface FileTreeProps {
  items: FileTreeItemInfo[];
  rootUrl: string;
  getTreeChildren: (sha: string, parentPath: string) => Promise<TreeItemInfo[]>;
}

export const FileTree: React.FC<FileTreeProps> = ({ items, rootUrl, getTreeChildren, ...rest }) => {
  const classes = useStyles();

  /* eslint-disable-next-line */
  const [_, forceUpdate] = React.useReducer(x => x + 1, 0);

  const renderTree = (item: FileTreeItemInfo) => {
    const onClick = async function (this: any, _: any) {
      item.children?.forEach(async (child) => {
        if (child.type !== 'tree' || child.children) return;
        child.children = await getTreeChildren(child.sha, child.path);
        console.log(child.children);
        this.setState({
          children: (
            child.children ?
              child.children.map((child: FileTreeItemInfo) =>
                <React.Fragment key={child.sha}>
                  {renderTree(child)}
                </React.Fragment>
              )
              :
              <></>
          )
        });
        forceUpdate();
      });
    }

    return (
      <IconTreeItem
        nodeId={item.path}
        labelText={item.name}
        labelIcon={item.type === 'tree' ? FolderOutlinedIcon : InsertDriveFileOutlinedIcon}
        href={item.type !== 'tree' ? rootUrl + item.path : undefined}
        onClick={onClick}
      >
        {
          item.type === 'tree' ?
            item.children ?
              item.children.map((child: FileTreeItemInfo) =>
                <React.Fragment key={child.sha}>
                  {renderTree(child)}
                </React.Fragment>
              )
              :
              <></>
            :
            null
        }
      </IconTreeItem >
    )
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      {...rest}
    >
      {items.map((val: FileTreeItemInfo) =>
        <React.Fragment key={val.sha}>
          {renderTree(val)}
        </React.Fragment>
      )}
    </TreeView>
  )
}

export default FileTree;