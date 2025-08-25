import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Dispatch, ElementType, RefObject, SetStateAction } from "react";
import { SvgProps } from "react-native-svg";

export interface TabItemProps {
  label: string;
  isActive: boolean;
  isWhite: boolean;
  onPress: () => void;
  Icon?: React.ComponentType<SvgProps>;
}

export interface CustomInputProps {
  placeholder: string;
  value?: string;
  editable?: boolean;
  [key: string]: any;
}
export interface UserInfoTypes {
  firstName?: string;
  lastName?: string;
  birthday?: Date | null;
  email?: string;
  password?: string;
}

export interface SignUpComProps {
  userInfo: UserInfoTypes;
  onNext: (data: UserInfoTypes) => void;
  setStep: Dispatch<SetStateAction<number>>;
  mutate?: () => void;
}

export interface LocationProps {
  lat: number;
  lng: number;
}

export interface Square {
  starting: number;
  ending: number;
}

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  password: string;
  profilePic: string;
  bio?: string;
  created?: LocationData[];
  wallet: number;
  cardList: DepositCardlist[];
}
export interface DepositCardlist {
  paymentMethodId: string;
}
export interface FacilitiesType {
  src: string;
  tittle: string;
}

export interface WalletActivitiesTypes {
  length: number;
  map(
    arg0: (data: any, index: any) => import("react").JSX.Element
  ): import("react").ReactNode;
  money: number;
  createdAt: Date;
  status: string;
  via: string;
  method: string;
  createdBy: string;
}

export interface BookingSchemaPropsTypes {
  startDate: Date;
  endDate: Date;
  price: number;
  bookedBy: string | null;
  hostedBy: string;
  property: string;
  pets?: number;
  adults?: number;
  infants?: number;
  children?: number;
  totalPersons: number;
  stayInNights: number;
  wallet_id: string;
  status?: string;
}
export interface RecievingReviewSchemaPropsType {
  reviewBy: UserData;
  feedbackMessage: string;
  bookingId: BookingSchemaPropsTypes;
  propertyId: LocationData;
  stars: number;
  createdAt: Date;
}
export interface CreditCardList {
  isPrimary: boolean;
  paymentMethodId: string;
  last4: number;
  brand: string;
  exp_month: number;
  exp_year: number;
  customerID: string;
}
export interface DepositCreditCardTypes {
  paymentMethods: CreditCardList[];
  wallet: number;
}

export interface LocationData {
  title: string;
  _id: string;
  location: LocationProps;
  createdBy: UserData;
  beds: number;
  baths: number;
  size: Square;
  overview: string;
  facilities: FacilitiesType[];
  rent: number;
  license: string;
  furnished: string;
  link: string;
  files: string[];
  likedBy: any[];
  type: string;
  maxpersons: number;
  totalreviews: RecievingReviewSchemaPropsType[];
  avgRating: number;
}

export interface TopNavigationProps {
  data: LocationData[] | undefined;
}
export interface BookingCarouselProps {
  data: string[];
  title: string;
  rent: number;
  likedBy: any[];
  totalReviews: RecievingReviewSchemaPropsType[];
  avgRating: number;
  propertyId: string;
}

export interface ClerkLoginProp {
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

export interface TopTabCompRendererProp {
  Children: ElementType | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: LocationData[] | undefined;
}

export interface UpdateLike {
  liked: boolean;
  propertyId: string;
}
export type ToggleLikeResponse = {
  success: boolean;
  message: string;
};

export type ToggleLikeVariables = {
  liked: boolean;
  propertyId: string;
};

export interface DepositCardListProp {
  data: DepositCreditCardTypes | undefined;
  value: string;
}
export interface PaymentMethod {
  card: {
    country: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
    id: string;
  };
}

export interface UserDataWithCardList {
  data: UserData;
  paymentMethods: PaymentMethod[];
}

export interface HandleCardDefaultProps {
  customerID: string;
  paymentMethodId: string;
}

export interface ReviewSchemaPropsType {
  reviewBy: string | null;
  feedbackMessage: string;
  bookingId: string | null;
  propertyId: string | null;
  stars: number;
}

export interface TripListpropstypes {
  startDate: Date;
  endDate: Date;
  price: number;
  bookedBy: string | null;
  hostedBy: UserData;
  property: LocationData;
  pets?: number;
  adults?: number;
  infants?: number;
  children?: number;
  totalPersons: number;
  stayInNights: number;
  status?: string;
  _id?: string;
  reviewtaken: ReviewSchemaPropsType;
}

export interface TripComProp {
  data: TripListpropstypes[] | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export interface CancelBookingPropsTypes {
  bookingId: string | string[];
  status: string;
}

export interface NotificationSchemaPropsTypes {
  User: UserData;
  message: string;
  image: string;
  link: string;
  read: boolean;
  date: Date;
  type: string;
}

interface SendMessageProps {
  message: string;
  file: File | null;
  mediaFile?: File[] | null;
}

export interface MessageSchemaPropsTypes {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: SendMessageProps;
  propertyId: string;
  conversationId?: string | null;
}

export interface ReservedPropertiesDate {
  some: any;
  startDate: Date;
  endDate: Date;
}

export interface ChooseOptionsTypes {
  handleChange: (
    key:
      | "propertyType"
      | "title"
      | "location"
      | "beds"
      | "baths"
      | "size"
      | "overview"
      | "facilities"
      | "rate"
      | "maxPersons"
      | "licenseId"
      | "isFurnished"
      | "livoraLink",
    value: string | string[]
  ) => void;
  bottomSheetRef: RefObject<BottomSheetMethods>;
  selectedFacilities?: string[];
}

export type FileItem = {
  uri: string;
  name: string;
  type: string;
};

export interface AddLocationData {
  title: string;
  type: string;
  location: LocationProps;
  beds: number;
  baths: number;
  size: string;
  overview: string;
  facilities: string[];
  rent: number;
  license: string;
  furnished: string;
  link: string;
  files: FileItem[];
  maxpersons: number;
}
