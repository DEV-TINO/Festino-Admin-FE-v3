import { OrderItem } from './../modals/modal.types';
export interface IconOrderListProps {
  isActive?: boolean;
}

export interface IconClockProps {
  className?: string;
}

export interface SvgCharacterProps {
  width?: number;
}

export interface IconOrderCheckProps {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface IconOrderDetailProps {
  className?: string;
  onClick?: () => void;
}

export interface IconRefreshVectorProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  className?: string
  onClick?: () => void;
}

export interface IconSearchProps {
  width?: number;
  height?: number;
  fillColor?: string;
  className?: string;
}

export interface IconOrderMinusProps {
  className?: string;
  onClick?: () => void;
}

export interface IconOrderPlusProps {
  className?: string;
  onClick?: () => void;
}

export interface IconTrashProps {
  className?: string;
  onClick?: () => void;
}

export interface IconCloseProps {
  onClick: () => void;
  className?: string;
}

export interface IconDeleteProps {
  onClick: () => void;
  className?: string;
}

export interface IconLoadingProps {
  width?: number;
}

export interface IconRadioProps {
  isActive?: boolean;
  readOnly?: boolean;
}

export interface IconRadioProps {
  isActive?: boolean;
  readOnly?: boolean;
}

export interface ModalWrapperProps {
  children: React.ReactNode;
}