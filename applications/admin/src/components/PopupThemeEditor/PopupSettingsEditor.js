import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControl,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { OpenInNew as OpenInNewIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  multiselectMenu: {
    maxHeight: theme.spacing(6) * 4.5 + theme.spacing(1),
    width: 250
  }
}));

const PopupSettingsEditor = ({ popupTheme, onChange }) => {
  const classes = useStyles();

  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange({ ...popupTheme, [name]: value });
  };

  const handleChangeStrategy = (event) => {
    const { value: strategies } = event.target;

    onChange({ ...popupTheme, strategies });
  };

  const handleCategoriesChange = (event) => {
    const { value = '' } = event.target;
    const categories = value.split(',');

    onChange({
      ...popupTheme,
      categories
    });
  };

  const handleReferenceUrlButtonClick = () => {
    const isExternal = !!popupTheme.referenceUrl?.match(/^https?:\/\//);
    const isDataUrl = !!popupTheme.referenceUrl?.match(/^data:/);

    if (isExternal) {
      window.open(popupTheme.referenceUrl);
    }

    if (isDataUrl) {
      const newWindow = window.open('');
      const image = new Image();

      image.src = popupTheme.referenceUrl;
      newWindow.document.write(image.outerHTML);

      // Fit the image.
      newWindow.document.body.style.height = '100%';
      newWindow.document.querySelector('img').style.maxWidth = '100%';
      newWindow.document.querySelector('img').style.maxHeight = '100%';
    }
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
          <InputLabel id="type-label">Strategies</InputLabel>
          <Select
            name="strategies"
            labelId="strategies"
            label="Strategies"
            multiple
            required
            value={popupTheme.strategies}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={{
              PaperProps: {
                className: classes.multiselectMenu
              }
            }}
            onChange={handleChangeStrategy}
          >
            <MenuItem value="UPSELL">Upsell</MenuItem>
            <MenuItem value="CROSS_SELL">Cross-sell</MenuItem>
            <MenuItem value="POPUP">Popup</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            name="notes"
            label="Notes"
            margin="normal"
            variant="outlined"
            multiline
            rows={12}
            required
            value={popupTheme.notes}
            onChange={handleChange}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <TextField
            name="categories"
            label="Categories (comma-delimited)"
            margin="normal"
            variant="outlined"
            required
            value={popupTheme.categories.join(',')}
            onChange={handleCategoriesChange}
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
        <FormControl fullWidth>
          <TextField
            name="referenceUrl"
            label="Reference URL"
            margin="normal"
            variant="outlined"
            value={popupTheme.referenceUrl}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleReferenceUrlButtonClick}>
                    <OpenInNewIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
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
