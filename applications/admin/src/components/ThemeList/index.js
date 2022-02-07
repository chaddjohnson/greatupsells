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
import ThemeListRow from './ThemeListRow';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    paddingBottom: theme.spacing(2)
  }
}));

const ThemeList = ({ themes, onCloneTheme }) => {
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
                  <TableCell>strategies</TableCell>
                  <TableCell>Categories</TableCell>
                  <TableCell>Preview</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {themes?.map((theme, index) => (
                  <ThemeListRow
                    key={index}
                    theme={theme}
                    onCloneTheme={onCloneTheme}
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
        href="/themes/new"
      />
    </>
  );
};

ThemeList.propTypes = {
  themes: PropTypes.arrayOf(PropTypes.object),
  onCloneTheme: PropTypes.func
};

ThemeList.defaultProps = {
  themes: [],
  onCloneTheme: () => {}
};

export default ThemeList;
