import ConfirmDialog from '../molecules/feedback/ConfirmDialog'
import { useCallback } from 'react'
import { FolderIcon } from '../atoms/display/Icons'
import Label from '../atoms/display/Label'
import { useDispatch } from 'react-redux'
import { FlexColumn, FlexRow } from '../atoms/layout/Flex'
import NotesActions from '../../store/notes/actions'
import NoteTitleLabel from '../molecules/display/NoteTitleLabel'
import { useNoteDeleteDialog } from '../../hooks/useDialogs'

export default function NoteDeleteDialog() {
  const { state, close } = useNoteDeleteDialog()
  const dispatch = useDispatch()
  const handleOk = useCallback(async () => {
    if (state) {
      await dispatch(NotesActions.deleteNote({ note: state.note }))
    }
    close()
  }, [dispatch, state, close])

  return (
    <ConfirmDialog open={state !== undefined} title={{ value: 'Delete' }} onOk={handleOk} onCancel={close}>
      <FlexColumn>
        <FlexRow>
          <FolderIcon />
          {state && <NoteTitleLabel note={state.note} />}
        </FlexRow>
        <Label text={{ value: 'Do you want to delete this note?' }} />
        <Label text={{ value: 'This operation is irreversible.' }} />
      </FlexColumn>
    </ConfirmDialog>
  )
}
