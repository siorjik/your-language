import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  ...compat.config({
    rules: {
      'semi': ['warn', 'never'],
      'max-len': ['warn', { code: 130, ignoreUrls: true }],
      'quotes': ['warn', 'single'],
      '@typescript-eslint/no-unused-vars': 'warn',
      'import/no-anonymous-default-export': 0,
      'react-hooks/exhaustive-deps': 0,
    },
  }),
]

export default eslintConfig
