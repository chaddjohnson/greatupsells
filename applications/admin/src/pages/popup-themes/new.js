import Head from 'next/head';
import { useRouter } from 'next/router';
import { Breadcrumbs, Hidden } from '@material-ui/core';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, PopupThemeEditor } from '../../components';
import { usePopupTheme } from '../../hooks';

const initialHtmlTemplate = `
<div class="container">
  Hello World
</div>
`.trim();

const initialCssTemplate = `
.container {
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
`.trim();

const initialVariables = [
  {
    name: 'popupBackgroundColor',
    label: 'Popup background',
    type: 'COLOR',
    group: 'Popup',
    value: '#FFFFFF'
  },
  {
    name: 'maskBackgroundColor',
    label: 'Mask background',
    type: 'COLOR',
    group: 'Popup',
    value: 'rgba(0, 0, 0, 0.5)',
    options: {
      allowAlpha: true
    }
  },
  {
    name: 'bodyFont',
    label: 'Font',
    type: 'FONT',
    group: 'Body text',
    value: "'Work Sans'"
  },
  {
    name: 'bodyFontSize',
    label: 'Base size',
    type: 'FONTSIZE',
    group: 'Body text',
    value: '16'
  },
  {
    name: 'showOriginalPrice',
    label: 'Show original price',
    type: 'OPTION',
    group: 'Settings',
    value: 'true'
  }
];

const initialValues = {
  name: '',
  displayOrder: 1,
  strategy: 'UPSELL',
  categories: [],
  thumbnailImageUrl: '',
  description: '',
  template: {
    html: initialHtmlTemplate,
    css: initialCssTemplate,
    javascript: ''
  },
  variables: initialVariables,
  formFields: []
};

const NewPopupThemePage = () => {
  const router = useRouter();
  const { savePopupTheme } = usePopupTheme();

  const handleSubmit = async (values) => {
    const popupTheme = await savePopupTheme(values);

    router.push(`/popup-themes/${popupTheme._id}`);
  };

  return (
    <>
      <Head>
        <title>New Popup Theme</title>
      </Head>
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
        <PopupThemeEditor
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </Layout>
    </>
  );
};

export default NewPopupThemePage;
