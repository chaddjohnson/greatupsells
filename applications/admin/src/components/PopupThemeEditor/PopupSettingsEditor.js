import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControl,
  TextField,
  Select,
  InputLabel,
  MenuItem
} from '@material-ui/core';

const PopupSettingsEditor = ({ popupTheme, onChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange({
      ...popupTheme,
      [name]: value
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <TextField
            name="name"
            label="Name"
            margin="normal"
            variant="outlined"
            required
            value={popupTheme.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            name="displayOrder"
            label="Display Order"
            margin="normal"
            variant="outlined"
            type="number"
            required
            value={popupTheme.displayOrder}
            inputProps={{
              min: 1
            }}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="outlined" margin="normal" fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            name="type"
            labelId="type"
            label="Type"
            required
            value={popupTheme.type}
            onChange={handleChange}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="color">Color</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <TextField
            name="category"
            label="Category"
            margin="normal"
            variant="outlined"
            required
            value={popupTheme.category}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            name="thumbnailImageUrl"
            label="Thumbnail URL"
            margin="normal"
            variant="outlined"
            required
            value={popupTheme.thumbnailImageUrl}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            name="description"
            label="Description"
            margin="normal"
            variant="outlined"
            required
            value={popupTheme.description}
            onChange={handleChange}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

PopupSettingsEditor.propTypes = {
  popupTheme: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

PopupSettingsEditor.defaultProps = {
  onChange: () => {}
};

export default PopupSettingsEditor;
