#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

claude plugin marketplace add typesafe-ai/skills
claude plugin install typesafe@typesafe-ai

claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install claude-code-setup@claude-plugins-official
