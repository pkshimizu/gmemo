import { Note } from '../../store/notes/models'
import NoteMenu from './NoteMenu'
import TextEditor from '../atoms/inputs/TextEditor'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NotePropertiesPanel from './NotePropertiesPanel'
import WorkspaceTabPanel from '../molecules/navigation/WorkspaceTabPanel'
import { updateNote } from '../../store/notes/actions'
import { editorSettingsSelector } from '../../store/session/selectors'
import { useEditor } from '../../hooks/useEditor'
import MarkdownViewer from '../atoms/display/MarkdownViewer'
import RelativeBox from '../atoms/layout/RelativeBox'
import AbsoluteBox from '../atoms/layout/AbsoluteBox'

type NoteTabPanelProps = {
  notes: Note[]
  activeNote: Note
}

export default function NoteTabPanel({ notes, activeNote }: NoteTabPanelProps) {
  const { getEditor, setEditor, fontSize, editorRight, previewLeft } = useEditor(activeNote)
  const [propertiesPanel, setPropertiesPanel] = useState(false)
  const [cursorRow, setCursorRow] = useState<number>(0)
  const [syncScroll, setSyncScroll] = useState(true)
  const editorSettings = useSelector(editorSettingsSelector)
  const dispatch = useDispatch()
  const handleLoad = useCallback(
    (id, editor) => {
      editor.resize()
      setEditor(id, editor)
    },
    [setEditor]
  )
  const handleChangeCursor = useCallback(() => {
    const editor = getEditor(activeNote.id)
    setCursorRow((editor?.getCursorPosition().row ?? 0) + 1)
  }, [getEditor, activeNote, setCursorRow])

  useEffect(() => {
    const editor = getEditor(activeNote.id)
    if (syncScroll) {
      editor?.getSession().getSelection().on('changeCursor', handleChangeCursor)
    } else {
      editor?.getSession().getSelection().off('changeCursor', handleChangeCursor)
    }

    return () => {
      editor?.getSession().getSelection().off('changeCursor', handleChangeCursor)
    }
  }, [getEditor, activeNote, syncScroll, handleChangeCursor])

  const handleResize = useCallback(() => {
    const editor = getEditor(activeNote.id)
    editor?.resize()
  }, [activeNote, getEditor])
  const handleChangeContent = useCallback(
    (content: string) => {
      dispatch(updateNote({ note: activeNote, content }))
    },
    [dispatch, activeNote]
  )

  return (
    <WorkspaceTabPanel
      menu={
        <NoteMenu
          note={activeNote}
          syncScroll={syncScroll}
          onOpenProperties={() => setPropertiesPanel(!propertiesPanel)}
          onChangeSyncScroll={setSyncScroll}
        />
      }
      propertiesPanel={propertiesPanel ? <NotePropertiesPanel note={activeNote} /> : undefined}
      onClosePropertiesPanel={() => setPropertiesPanel(false)}
    >
      <RelativeBox width={'100%'} height={'100%'}>
        <AbsoluteBox top={0} bottom={0} left={0} right={editorRight} onResize={handleResize}>
          {notes.map((note) => (
            <TextEditor
              key={note.id}
              content={note.content}
              keyBinding={editorSettings.keyBinding}
              theme={editorSettings.theme}
              mode={note.contentType}
              fontSize={fontSize}
              height={note.id === activeNote.id ? '100%' : '0'}
              onLoad={(editor) => handleLoad(note.id, editor)}
              onChangeContent={handleChangeContent}
            />
          ))}
        </AbsoluteBox>
        {activeNote.contentType === 'markdown' ? (
          <AbsoluteBox top={0} bottom={0} left={previewLeft} right={0} hidden={previewLeft === '100%'}>
            <MarkdownViewer content={activeNote.content} row={cursorRow} />
          </AbsoluteBox>
        ) : (
          <></>
        )}
      </RelativeBox>
    </WorkspaceTabPanel>
  )
}
