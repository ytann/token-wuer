import type { PlatformConfig } from './types';

export const WATER_ML_PER_TOKEN = 0.003;

export const WATER_CITATION =
  'Water usage estimate based on: Li et al. (2023) "Making AI Less Thirsty" and Patterson et al. (2022) data center water efficiency benchmarks. Ratio: 3 ml per 1,000 tokens (inference only). Token counts approximated using GPT tokenization with platform-agnostic multiplier.';

export const DEFAULT_PLATFORMS: PlatformConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    urlMatch: 'chatgpt.com',
    selectors: {
      messages: '[data-message-author-role="assistant"][data-message-id]',
      pageTitle: 'title',
      titleSelector: 'h1, [data-testid="chat-header-title"]',
      input: '#prompt-textarea, [contenteditable="true"]',
    },
    builtIn: true,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    urlMatch: 'gemini.google.com',
    selectors: {
      messages: 'message-content',
      pageTitle: 'title',
      titleSelector: 'message-content:first-of-type',
      input: 'rich-textarea, [contenteditable]',
    },
    builtIn: true,
  },
  {
    id: 'claude',
    name: 'Claude',
    urlMatch: 'claude.ai',
    selectors: {
      messages: '[data-start], .font-claude-message',
      pageTitle: 'title',
      titleSelector: '[data-testid="chat-name"]',
      input: '.ProseMirror, [contenteditable]',
    },
    builtIn: true,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    urlMatch: 'perplexity.ai',
    selectors: {
      messages: '.prose, .message',
      pageTitle: 'title',
      titleSelector: 'h1, .chat-title',
      input: 'textarea',
    },
    builtIn: true,
  },
];
