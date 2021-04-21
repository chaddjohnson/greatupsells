import { Breadcrumbs, Hidden } from '@material-ui/core';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, PopupThemeEditor } from '../../components';
import { usePopupTheme } from '../../hooks';

const initialTemplate = `
<style>
  .popup-container {
    font-family: {{ bodyFont }};
    font-size: {{ bodyFontSize }}px;
    color: black;
    background-color: {{ popupBackgroundColor }};
    width: 650px;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    box-sizing: border-box;
    position: relative;

    /* Reference: https://gist.github.com/hsleonis/55712b0eafc9b25f1944 */
    font-size: 100%;
    -webkit-text-size-adjust: 100%;
    font-variant-ligatures: none;
    -webkit-font-variant-ligatures: none;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    text-shadow: rgba(0, 0, 0, .01) 0 0 1px;

    /* Reference: https://gist.github.com/chemicaloliver/1234670 */
    border: 1px solid rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    -webkit-background-clip: padding-box;
    -moz-background-clip: padding-box;
    background-clip: padding-box;
  }
</style>
<form novalidate onsubmit="{{ submitHandler }}">
  <div class="popup-container">
    Hello World
  </div>
</form>
`.trim();

const initialVariables = [
  {
    name: 'popupBackgroundColor',
    label: 'Popup background',
    type: 'color',
    group: 'Popup',
    value: '#FFFFFF'
  },
  {
    name: 'maskBackgroundColor',
    label: 'Mask background',
    type: 'color',
    group: 'Popup',
    value: 'rgba(0, 0, 0, 0.5)',
    options: {
      allowAlpha: true
    }
  },
  {
    name: 'bodyFont',
    label: 'Font',
    type: 'font',
    group: 'Body text',
    value: "'Work Sans'"
  },
  {
    name: 'bodyFontSize',
    label: 'Base size',
    type: 'fontSize',
    group: 'Body text',
    value: '16'
  },
  {
    name: 'showOriginalPrice',
    label: 'Show original price',
    type: 'option',
    group: 'Settings',
    value: 'true'
  }
];

const initialValues = {
  name: '',
  displayOrder: 1,
  type: 'UPSELL',
  category: '',
  thumbnailImageUrl: '',
  description: '',
  template: initialTemplate,
  variables: initialVariables,
  formFields: []
};

const NewPopupThemePage = () => {
  const { savePopupTheme } = usePopupTheme();

  const handleSubmit = async (values) => {
    await savePopupTheme(values);
  };

  return (
    <Layout
      title={
        <>
          <Hidden xsDown>
            <Breadcrumbs>
              <Link href="/popup-themes">Popup Themes</Link>
              <span>New Popup Theme</span>
            </Breadcrumbs>
          </Hidden>
          <Hidden smUp>
            <span>New Popup Theme</span>
          </Hidden>
        </>
      }
      icon={<PopupThemesIcon />}
      contentProps={{
        style: {
          height: '100%'
        }
      }}
    >
      <PopupThemeEditor initialValues={initialValues} onSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewPopupThemePage;
