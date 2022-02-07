import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  TextField,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Clear as ClearIcon } from '@material-ui/icons';
import RED from '@material-ui/core/colors/red';

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: theme.spacing(2)
  },
  table: {
    width: 'auto'
  },
  nameTableCell: {
    width: 400
  },
  typeTableCell: {
    width: 150
  },
  formControl: {
    width: '100%',
    minWidth: 200
  },
  typeField: {
    width: 150
  },
  removeButton: {
    color: RED[600],

    '&:hover': {
      color: RED[900]
    }
  },
  tableActions: {
    textAlign: 'center',
    paddingTop: theme.spacing(1)
  }
}));

const ThemeFormFieldsEditor = ({ theme, onChange }) => {
  const classes = useStyles();

  const handleChange = (event, index) => {
    const { name, value } = event.target;

    onChange({
      ...theme,
      formFields: [
        ...theme.formFields.slice(0, index),
        { ...theme.formFields[index], [name]: value },
        ...theme.formFields.slice(index + 1)
      ]
    });
  };

  const handleAdd = () => {
    onChange({
      ...theme,
      formFields: [
        ...theme.formFields,
        {
          name: '',
          type: 'text'
        }
      ]
    });
  };

  const handleRemove = (index) => {
    onChange({
      ...theme,
      formFields: [
        ...theme.formFields.slice(0, index),
        ...theme.formFields.slice(index + 1)
      ]
    });
  };

  return (
    <>
      <TableContainer className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {theme.formFields.map(({ name, type }, index) => (
              <TableRow key={index}>
                <TableCell className={classes.nameTableCell}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      name="name"
                      variant="outlined"
                      placeholder="Name"
                      required
                      value={name}
                      onChange={(event) => handleChange(event, index)}
                    />
                  </FormControl>
                </TableCell>
                <TableCell className={classes.typeTableCell}>
                  <FormControl>
                    <Select
                      className={classes.typeField}
                      name="type"
                      variant="outlined"
                      placeholder="Type"
                      required
                      value={type}
                      onChange={(event) => handleChange(event, index)}
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="tel">Phone</MenuItem>
                      <MenuItem value="checkbox">Checkbox</MenuItem>
                      <MenuItem value="select">Select</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton
                    className={classes.removeButton}
                    aria-label="Remove"
                    onClick={() => handleRemove(index)}
                  >
                    <ClearIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.tableActions}>
        <Button
          className={classes.addButton}
          variant="contained"
          color="secondary"
          onClick={handleAdd}
        >
          Add Form Field
        </Button>
      </div>
    </>
  );
};

ThemeFormFieldsEditor.propTypes = {
  theme: PropTypes.shape({
    formFields: PropTypes.array.isRequired
  }).isRequired,
  onChange: PropTypes.func
};

ThemeFormFieldsEditor.defaultProps = {
  onChange: () => {}
};

export default ThemeFormFieldsEditor;
