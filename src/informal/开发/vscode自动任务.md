# VSCode自动任务

## 自动Merge
需要搭配以下工具
+ glab
+ Gitlab WorkFlows VSCode插件

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "git-mr",
      "type": "shell",
      "command": "glab",
      "args": [
        "mr",
        "new",
        "-b",
        "master",
        "-d",
        "merge",
        "-t",
        "${input:target}"
      ],
      "problemMatcher": []
    },
    {
      "label": "git-ml",
      "type": "shell",
      "command": "glab",
      "args": [
        "mr",
        "list"
      ],
      "problemMatcher": []
    },
    {
      "label": "git-close",
      "type": "shell",
      "command": "glab",
      "args": [
        "mr",
        "close",
        "${input:mrid}"
      ],
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "target",
      "type": "pickString",
      "options": [
        "buildwork",
        "buildtuhutest",
        "buildut",
        "master"
      ],
      "description": "请输入目标分支"
    },
    {
      "id": "mrid",
      "type": "promptString",
      "description": "请输入merge id"
    }
  ],
}
```