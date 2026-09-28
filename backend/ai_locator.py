import json
import os
from pathlib import Path
from dotenv import load_dotenv

from openai import OpenAI

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


SYSTEM_PROMPT = """
你是网页元素定位助手。根据目标元素信息和附近 HTML，给出定位候选。
优先使用稳定的 id、data-*、aria-* 等属性；避免依赖容易变化的位置序号。
只返回 JSON，例如：
{"candidates":[
  {"type":"css","value":"button[data-testid='submit']"},
  {"type":"xpath","value":"//button[@data-testid='submit']"}
]}
不要假定候选一定正确，调用方会在页面中验证。
"""

def generate_locators(context: dict) -> list[dict]:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("缺少 DEEPSEEK_API_KEY")

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com",
        timeout=20.0,
    )

    response = client.chat.completions.create(
        model=os.getenv("DEEPSEEK_MODEL", "deepseek-flash"),
        extra_body={"thinking": {"type": "disabled"}},
        response_format={"type": "json_object"},
        max_tokens=800,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(context, ensure_ascii=False)},
        ],
    )

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("DeepSeek 返回了空结果")

    candidates = json.loads(content).get("candidates", [])
    return [
        item for item in candidates
        if isinstance(item, dict)
        and item.get("type") in {"css", "xpath"}
        and isinstance(item.get("value"), str)
    ]