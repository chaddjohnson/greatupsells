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
import PopupThemeListRow from './PopupThemeListRow';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    paddingBottom: theme.spacing(2)
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
                  <TableCell>Categories</TableCell>
                  <TableCell>Preview</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {popupThemes?.map((popupTheme, index) => (
                  <PopupThemeListRow
                    key={index}
                    popupTheme={popupTheme}
                    onClonePopupTheme={onClonePopupTheme}
                  />
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
