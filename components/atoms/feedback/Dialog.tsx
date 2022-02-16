import MuiDialog from '@mui/material/Dialog'
import MuiDialogTitle from '@mui/material/DialogTitle'
import MuiDialogContent from '@mui/material/DialogContent'
import MuiDialogActions from '@mui/material/DialogActions'
import { ReactElement } from 'react'
import { LabelText, useLocale } from '../../../hooks/useLocale'

export type DialogWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type DialogProps = {
  open: boolean
  title?: LabelText
  width?: DialogWidth
  children: ReactElement | ReactElement[]
  actions?: ReactElement | ReactElement[]
  onClose: () => void
}

export default function Dialog({ open, title, width = 'sm', children, actions, onClose }: DialogProps) {
  const { t } = useLocale()
  
  return (
    <MuiDialog open={open} fullWidth maxWidth={width} onClose={onClose}>
      {title && <MuiDialogTitle>{t(title)}</MuiDialogTitle>}
      <MuiDialogContent>{children}</MuiDialogContent>
      {actions && <MuiDialogActions>{actions}</MuiDialogActions>}
    </MuiDialog>
  )
}
