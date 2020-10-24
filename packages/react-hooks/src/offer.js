import {
  useQuery,
  useMutation
} from '@neatowebsolutions/upselling-graphql-client';
import {
  OFFER_QUERY,
  CREATE_OFFER_MUTATION,
  UPDATE_OFFER_MUTATION
} from '@neatowebsolutions/upselling-graphql-queries';
import useToast from './toast';

const useOffer = (offerId) => {
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    data: offer,
    loading: offerLoading,
    error: offerError,
    mutate: mutateOffer
  } = useQuery(offerId ? OFFER_QUERY : null, { id: offerId });

  const create = useMutation(CREATE_OFFER_MUTATION);
  const update = useMutation(UPDATE_OFFER_MUTATION);

  const createOffer = async (data) => {
    try {
      await create(data);

      showSuccessToast('Offer created');
    } catch (error) {
      showErrorToast('Error creating offer');
    }
  };

  const updateOffer = async (data) => {
    try {
      mutateOffer(data, false);
      await update(data);

      showSuccessToast('Offer saved');
    } catch (error) {
      showErrorToast('Error saving offer');
    }
  };

  return {
    offer,
    offerLoading,
    offerError,
    createOffer,
    updateOffer,
    fetchOffer: mutateOffer
  };
};

export default useOffer;
