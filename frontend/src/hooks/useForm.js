import { useCallback, useState } from 'react'

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)

  const setField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
  }, [])

  const reset = useCallback(() => setValues(initialValues), [initialValues])

  const bind = useCallback((name) => ({
    value: values[name] ?? '',
    onChange: (e) => setField(name, e.target ? e.target.value : e)
  }), [values, setField])

  return { values, setValues, setField, reset, bind }
}

export default useForm
