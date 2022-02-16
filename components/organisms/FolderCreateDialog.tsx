import FormDialog from '../molecules/feedback/FormDialog'
import { useCallback } from 'react'
import { Folder } from '../../store/notes/models'
import TextField from '../atoms/inputs/TextField'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createFolder } from '../../store/notes/actions'

type FolderSettingDialogProps = {
  open: boolean
  folder: Folder
  onClose: () => void
}

export default function FolderCreateDialog({ open, folder, onClose }: FolderSettingDialogProps) {
  const schema = yup.object().shape({
    name: yup.string().max(30).required(),
  })
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const dispatch = useDispatch()
  const handleClose = useCallback(() => {
    onClose()
    reset()
  }, [onClose, reset])
  const handleSaveFolderSettings = useCallback(
    async (data) => {
      await dispatch(createFolder({ name: data.name, parentFolder: folder }))
      onClose()
    },
    [dispatch, folder, onClose]
  )

  return (
    <FormDialog
      open={open}
      title={{ value: 'Create folder' }}
      width={'xs'}
      onSubmit={handleSubmit(handleSaveFolderSettings)}
      onClose={handleClose}
    >
      <TextField label={{ value: 'Folder Name' }} focused register={register('name')} error={errors.name?.message} />
    </FormDialog>
  )
}
