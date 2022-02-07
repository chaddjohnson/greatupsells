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
    paddingBottom: theme.spacing(2)
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

const ThemeVariablesEditor = ({ theme, onChange }) => {
  const classes = useStyles();

  const handleChange = (event, index) => {
    const { name, value } = event.target;

    onChange({
      ...theme,
      variables: [
        ...theme.variables.slice(0, index),
        { ...theme.variables[index], [name]: value },
        ...theme.variables.slice(index + 1)
      ]
    });
  };

  const handleAdd = () => {
    onChange({
      ...theme,
      variables: [
        ...theme.variables,
        {
          name: '',
          label: '',
          value: '',
          group: '',
          type: 'text'
        }
      ]
    });
  };

  const handleRemove = (index) => {
    onChange({
      ...theme,
      variables: [
        ...theme.variables.slice(0, index),
        ...theme.variables.slice(index + 1)
      ]
    });
  };

  return (
    <>
      <TableContainer className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Options</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {theme.variables.map(
              ({ name, label, type, value, group, options = {} }, index) => (
                <TableRow key={index}>
                  <TableCell>
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
                  <TableCell>
                    <FormControl className={classes.formControl}>
                      <TextField
                        name="label"
                        variant="outlined"
                        placeholder="Label"
                        required
                        value={label}
                        onChange={(event) => handleChange(event, index)}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl className={classes.formControl}>
                      <TextField
                        name="value"
                        variant="outlined"
                        placeholder="Value"
                        required
                        value={value}
                        onChange={(event) => handleChange(event, index)}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl className={classes.formControl}>
                      <TextField
                        name="group"
                        variant="outlined"
                        placeholder="Group"
                        required
                        value={group}
                        onChange={(event) => handleChange(event, index)}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
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
                        <MenuItem value="TEXT">Text</MenuItem>
                        <MenuItem value="COLOR">Color</MenuItem>
                        <MenuItem value="FONT">Font</MenuItem>
                        <MenuItem value="FONTSIZE">Font Size</MenuItem>
                        <MenuItem value="OPTION">Option</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {Object.keys(options).map((key, optionIndex) => (
                      <div key={optionIndex}>
                        {key}: <em>{options[key]?.toString()}</em>
                      </div>
                    ))}
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
              )
            )}
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
          Add Variable
        </Button>
      </div>
    </>
  );
};

ThemeVariablesEditor.propTypes = {
  theme: PropTypes.shape({
    variables: PropTypes.array.isRequired
  }).isRequired,
  onChange: PropTypes.func
};

ThemeVariablesEditor.defaultProps = {
  onChange: () => {}
};

export default ThemeVariablesEditor;
