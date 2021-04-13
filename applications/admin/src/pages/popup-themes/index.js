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
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { Layout, Link, AddButton } from '../../components';
import { usePopupThemes } from '../../hooks';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    paddingBottom: theme.spacing(2)
  },
  nameTableCell: {
    minWidth: 400
  },
  typeTableCell: {
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

const typeMap = {
  UPSELL: 'Upsell',
  CROSS_SELL: 'Cross-sell',
  POPUP: 'Popup'
};

const LoadingComponent = () => (
  <>
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
  </>
);

const ErrorComponent = () => <p>Unable to load popup themes.</p>;

const PopupThemesPage = () => {
  const classes = useStyles();

  const {
    popupThemes,
    popupThemesLoading,
    popupThemesError
  } = usePopupThemes();

  return (
    <Layout title="Popup Themes" icon={<PopupThemesIcon />}>
      <Loader
        isLoading={popupThemesLoading}
        isError={!!popupThemesError}
        loadingComponent={LoadingComponent}
        errorComponent={ErrorComponent}
      >
        <Card>
          <CardContent>
            <TableContainer className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Preview</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {popupThemes?.map(
                    (
                      { _id, name, type, category, thumbnailImageUrl },
                      index
                    ) => (
                      <TableRow key={index}>
                        <TableCell className={classes.nameTableCell}>
                          <Link href={`/popup-themes/${_id}`}>{name}</Link>
                        </TableCell>
                        <TableCell className={classes.typeTableCell}>
                          {typeMap[type] || type}
                        </TableCell>
                        <TableCell className={classes.categoryTableCell}>
                          {category}
                        </TableCell>
                        <TableCell className={classes.thumbnailTableCell}>
                          <img
                            className={classes.thumbnail}
                            src={thumbnailImageUrl}
                            alt="Preview"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
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
      </Loader>
    </Layout>
  );
};

export default PopupThemesPage;
