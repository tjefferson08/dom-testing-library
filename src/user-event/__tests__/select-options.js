import {userEvent} from '../../'
import {setupSelect, addListeners} from './helpers/utils'

test('fires correct events', async () => {
  const {select, options, getEventSnapshot} = setupSelect()
  await userEvent.selectOptions(select, '1')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: select[name="select"][value="1"]

    select[name="select"][value="1"] - pointerdown
      selectedOptions: ["1"] -> ["1"]
    select[name="select"][value="1"] - mousedown: Left (0)
      selectedOptions: ["1"] -> ["1"]
    select[name="select"][value="1"] - focus
    select[name="select"][value="1"] - focusin
      selectedOptions: ["1"] -> ["1"]
    select[name="select"][value="1"] - pointerup
      selectedOptions: ["1"] -> ["1"]
    select[name="select"][value="1"] - mouseup: Left (0)
      selectedOptions: ["1"] -> ["1"]
    select[name="select"][value="1"] - click: Left (0)
      selectedOptions: ["1"] -> ["1"]
    option[value="1"] - mouseover: Left (0)
    option[value="1"] - mousemove: Left (0)
    option[value="1"] - mousedown: Left (0)
    option[value="1"] - mouseup: Left (0)
    option[value="1"] - click: Left (0)
    select[name="select"][value="1"] - change
      selectedOptions: ["1"] -> ["1"]
  `)
  const [o1, o2, o3] = options
  expect(o1.selected).toBe(true)
  expect(o2.selected).toBe(false)
  expect(o3.selected).toBe(false)
})

test('fires correct events on multi-selects', async () => {
  const {select, options, getEventSnapshot} = setupSelect({multiple: true})
  await userEvent.selectOptions(select, ['1', '3'])
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: select[name="select"][value=["1","3"]]

    select[name="select"][value=[]] - pointerdown
      selectedOptions: [] -> []
    select[name="select"][value=[]] - mousedown: Left (0)
      selectedOptions: [] -> []
    select[name="select"][value=[]] - focus
    select[name="select"][value=[]] - focusin
      selectedOptions: [] -> []
    select[name="select"][value=[]] - pointerup
      selectedOptions: [] -> []
    select[name="select"][value=[]] - mouseup: Left (0)
      selectedOptions: [] -> []
    select[name="select"][value=[]] - click: Left (0)
      selectedOptions: [] -> []
    option[value="1"] - mouseover: Left (0)
    option[value="1"] - mousemove: Left (0)
    option[value="1"] - mousedown: Left (0)
    option[value="1"] - mouseup: Left (0)
    option[value="1"] - click: Left (0)
    select[name="select"][value=["1"]] - change
      selectedOptions: ["1"] -> ["1"]
    option[value="3"] - mouseover: Left (0)
    option[value="3"] - mousemove: Left (0)
    option[value="3"] - mousedown: Left (0)
    option[value="3"] - mouseup: Left (0)
    option[value="3"] - click: Left (0)
    select[name="select"][value=["1","3"]] - change
      selectedOptions: ["1","3"] -> ["1","3"]
  `)
  const [o1, o2, o3] = options
  expect(o1.selected).toBe(true)
  expect(o2.selected).toBe(false)
  expect(o3.selected).toBe(true)
})

test('sets the selected prop on the selected option using option html elements', async () => {
  const {select, options} = setupSelect()
  const [o1, o2, o3] = options
  await userEvent.selectOptions(select, o1)
  expect(o1.selected).toBe(true)
  expect(o2.selected).toBe(false)
  expect(o3.selected).toBe(false)
})

test('a previously focused input gets blurred', async () => {
  const button = document.createElement('button')
  document.body.append(button)
  button.focus()
  const {getEventSnapshot} = addListeners(button)
  const {select} = setupSelect()
  await userEvent.selectOptions(select, '1')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - blur
    button - focusout
  `)
})

test('throws an error one selected option does not match', async () => {
  const {select} = setupSelect({multiple: true})
  const error = await userEvent
    .selectOptions(select, ['3', 'Matches nothing'])
    .catch(e => e)
  expect(error.message).toMatch(/not found/i)
})

test('throws an error if multiple are passed but not a multiple select', async () => {
  const {select} = setupSelect({multiple: false})
  const error = await userEvent.selectOptions(select, ['2', '3']).catch(e => e)
  expect(error.message).toMatch(/cannot select multiple/i)
})
