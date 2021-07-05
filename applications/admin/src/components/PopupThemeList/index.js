import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../Link';
import AddButton from '../AddButton';
import PopupThemeMenu from './PopupThemeMenu';

const strategyMap = {
  UPSELL: 'Upsell',
  CROSS_SELL: 'Cross-sell',
  POPUP: 'Popup'
};

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    paddingBottom: theme.spacing(2)
  },
  nameTableCell: {
    minWidth: 400
  },
  strategyTableCell: {
    minWidth: 200
  },
  categoryTableCell: {
    minWidth: 200
  },
  thumbnailTableCell: {
    minWidth: 100
  },
  thumbnail: {
    width: 'auto',
    height: 'auto',
    maxWidth: 80,
    maxHeight: 80,
    border: `1px solid ${theme.palette.action.selected}`
  }
}));

const PopupThemeList = ({ popupThemes, onClonePopupTheme }) => {
  const classes = useStyles();

  return (
    <>
      <Card>
        <CardContent>
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Strategy</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Preview</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {popupThemes?.map((popupTheme, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.nameTableCell}>
                      <Link href={`/popup-themes/${popupTheme._id}`}>
                        {popupTheme.name}
                      </Link>
                    </TableCell>
                    <TableCell className={classes.strategyTableCell}>
                      {strategyMap[popupTheme.strategy] || popupTheme.strategy}
                    </TableCell>
                    <TableCell className={classes.categoryTableCell}>
                      {popupTheme.category}
                    </TableCell>
                    <TableCell className={classes.thumbnailTableCell}>
                      <img
                        className={classes.thumbnail}
                        src={popupTheme.thumbnailImageUrl}
                        alt="Preview"
                      />
                    </TableCell>
                    <TableCell>
                      <PopupThemeMenu
                        popupTheme={popupTheme}
                        onClonePopupTheme={onClonePopupTheme}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <AddButton
        color="primary"
        aria-label="Add"
        component={Link}
        href="/popup-themes/new"
      />
    </>
  );
};

PopupThemeList.propTypes = {
  popupThemes: PropTypes.arrayOf(PropTypes.object),
  onClonePopupTheme: PropTypes.func
};

PopupThemeList.defaultProps = {
  popupThemes: [],
  onClonePopupTheme: () => {}
};

export default PopupThemeList;
