# サンプルコード

ReCoron APIを使用するためのサンプルコードです。

## Node.js / JavaScript

### セットアップ

```javascript
const API_TOKEN = process.env.RECORON_API_TOKEN;
const BASE_URL = 'https://your-domain.com/api';

// レスポンスハンドラー
async function handleResponse(response) {
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'リクエストに失敗しました');
  }
  
  return data.data;
}
```

### ジョブの操作

```javascript
// ジョブ一覧を取得
async function getJobs() {
  const response = await fetch(`${BASE_URL}/jobs`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  return handleResponse(response);
}

// ジョブを作成
async function createJob(jobData) {
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  });
  return handleResponse(response);
}

// 複数のジョブを一括作成
async function createJobsBatch(jobsData) {
  const response = await fetch(`${BASE_URL}/jobs/batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobsData)
  });
  return handleResponse(response);
}

// ジョブを更新
async function updateJob(jobId, updates) {
  const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  return handleResponse(response);
}

// ジョブを実行
async function executeJob(jobId) {
  const response = await fetch(`${BASE_URL}/jobs/${jobId}/execute`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  return handleResponse(response);
}

// ジョブを削除
async function deleteJob(jobId) {
  const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  return handleResponse(response);
}

// 使用量を取得
async function getUsage() {
  const response = await fetch(`${BASE_URL}/usage`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  return handleResponse(response);
}
```

### 使用例

```javascript
// 使用例
async function main() {
  try {
    // ジョブを作成
    const newJob = await createJob({
      name: 'Daily Report',
      url: 'https://api.example.com/report',
      method: 'POST',
      schedule: '0 9 * * *',
      timezone: 'Asia/Tokyo'
    });
    console.log('Created job:', newJob.id);

    // ジョブ一覧を取得
    const jobs = await getJobs();
    console.log('Total jobs:', jobs.length);

    // ジョブを実行
    const result = await executeJob(newJob.id);
    console.log('Execution result:', result.result.status);

    // 複数のジョブを一括作成
    const batchJobs = await createJobsBatch([
      {
        name: 'Job 1',
        url: 'https://api.example.com/endpoint1',
        method: 'GET',
        schedule: '0 * * * *'
      },
      {
        name: 'Job 2',
        url: 'https://api.example.com/endpoint2',
        method: 'POST',
        schedule: '*/30 * * * *'
      }
    ]);
    console.log('Created batch jobs:', batchJobs.count);

    // 使用量を確認
    const usage = await getUsage();
    console.log('Monthly executions:', usage.monthly.executions);
    console.log('Daily API calls:', usage.daily.apiCalls);
    console.log('Current jobs:', usage.current.jobs);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

---

## Python

### セットアップ

```python
import requests
import os
from typing import Dict, List, Any

API_TOKEN = os.environ['RECORON_API_TOKEN']
BASE_URL = 'https://your-domain.com/api'

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

def handle_response(response: requests.Response) -> Any:
    """レスポンスハンドラー"""
    data = response.json()
    
    if not data.get('success'):
        raise Exception(data.get('message', 'リクエストに失敗しました'))
    
    return data.get('data')
```

### ジョブの操作

```python
# ジョブ一覧を取得
def get_jobs() -> List[Dict]:
    response = requests.get(f'{BASE_URL}/jobs', headers=headers)
    return handle_response(response)

# ジョブを作成
def create_job(job_data: Dict) -> Dict:
    response = requests.post(
        f'{BASE_URL}/jobs',
        headers=headers,
        json=job_data
    )
    return handle_response(response)

# 複数のジョブを一括作成
def create_jobs_batch(jobs_data: List[Dict]) -> Dict:
    response = requests.post(
        f'{BASE_URL}/jobs/batch',
        headers=headers,
        json=jobs_data
    )
    return handle_response(response)

# ジョブを更新
def update_job(job_id: str, updates: Dict) -> Dict:
    response = requests.patch(
        f'{BASE_URL}/jobs/{job_id}',
        headers=headers,
        json=updates
    )
    return handle_response(response)

# ジョブを実行
def execute_job(job_id: str) -> Dict:
    response = requests.post(
        f'{BASE_URL}/jobs/{job_id}/execute',
        headers=headers
    )
    return handle_response(response)

# ジョブを削除
def delete_job(job_id: str) -> None:
    response = requests.delete(
        f'{BASE_URL}/jobs/{job_id}',
        headers=headers
    )
    return handle_response(response)

# 使用量を取得
def get_usage() -> Dict:
    response = requests.get(f'{BASE_URL}/usage', headers=headers)
    return handle_response(response)
```
        headers=headers
    )
    return handle_response(response)
```

### 使用例

```python
def main():
    try:
        # ジョブを作成
        new_job = create_job({
            'name': 'Daily Report',
            'url': 'https://api.example.com/report',
            'method': 'POST',
            'schedule': '0 9 * * *',
            'timezone': 'Asia/Tokyo'
        })
        print(f"Created job: {new_job['id']}")

        # ジョブ一覧を取得
        jobs = get_jobs()
        print(f"Total jobs: {len(jobs)}")

        # ジョブを実行
        result = execute_job(new_job['id'])
        print(f"Execution result: {result['result']['status']}")

        # 複数のジョブを一括作成
        batch_result = create_jobs_batch([
            {
                'name': 'Job 1',
                'url': 'https://api.example.com/endpoint1',
                'method': 'GET',
                'schedule': '0 * * * *'
            },
            {
                'name': 'Job 2',
                'url': 'https://api.example.com/endpoint2',
                'method': 'POST',
                'schedule': '*/30 * * * *'
            }
        ])
        print(f"Created batch jobs: {batch_result['count']}")

        # 使用量を確認
        usage = get_usage()
        print(f"Monthly executions: {usage['monthly']['executions']}")
        print(f"Daily API calls: {usage['daily']['apiCalls']}")
        print(f"Current jobs: {usage['current']['jobs']}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
```

---

## cURL

### ジョブの操作

```bash
# ジョブ一覧を取得
curl -X GET https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# ジョブを作成
curl -X POST https://your-domain.com/api/jobs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Report",
    "url": "https://api.example.com/endpoint",
    "method": "POST",
    "schedule": "0 9 * * *",
    "timezone": "Asia/Tokyo"
  }'

# 複数のジョブを一括作成
curl -X POST https://your-domain.com/api/jobs/batch \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Job 1",
      "url": "https://api.example.com/endpoint1",
      "method": "GET",
      "schedule": "0 9 * * *"
    },
    {
      "name": "Job 2",
      "url": "https://api.example.com/endpoint2",
      "method": "POST",
      "schedule": "0 * * * *"
    }
  ]'

# 特定のジョブを取得
curl -X GET https://your-domain.com/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# ジョブを更新
curl -X PATCH https://your-domain.com/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false
  }'

# ジョブを実行
curl -X POST https://your-domain.com/api/jobs/JOB_ID/execute \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# ジョブを削除
curl -X DELETE https://your-domain.com/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### APIキーの操作

```bash
# APIキー一覧を取得
curl -X GET https://your-domain.com/api/keys \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# APIキーを作成
curl -X POST https://your-domain.com/api/keys \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "scopes": ["read:jobs", "write:jobs"]
  }'

# 特定のAPIキーを取得
curl -X GET https://your-domain.com/api/keys/KEY_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# APIキーを削除
curl -X DELETE https://your-domain.com/api/keys/KEY_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### 使用量の確認

```bash
# 使用量統計を取得
curl -X GET https://your-domain.com/api/usage \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# レスポンス例
# {
#   "success": true,
#   "message": "success",
#   "data": {
#     "current": {
#       "jobs": 5,
#       "apiKeys": 2
#     },
#     "monthly": {
#       "year": 2025,
#       "month": 11,
#       "executions": 234,
#       "apiCalls": 1567,
#       "billedAmount": 0,
#       "paid": false
#     },
#     "daily": {
#       "date": "2025-11-04T00:00:00.000Z",
#       "executions": 12,
#       "apiCalls": 45,
#       "peakJobCount": 5,
#       "peakApiKeyCount": 2
#     },
#     "todayActivity": {
#       "jobsCreated": 2,
#       "jobsDeleted": 1,
#       "apiKeysCreated": 0,
#       "apiKeysDeleted": 0
#     }
#   }
# }
```

---

## TypeScript (型定義付き)

```typescript
// types.ts
interface Job {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  schedule: string;
  timezone: string;
  enabled: boolean;
  headers?: Record<string, string>;
  body?: string;
  nextRunAt: string;
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface CreateJobRequest {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  schedule: string;
  timezone?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Usage {
  current: {
    jobs: number;
    apiKeys: number;
  };
  monthly: {
    year: number;
    month: number;
    executions: number;
    apiCalls: number;
    billedAmount: number;
    paid: boolean;
  };
  daily: {
    date: string;
    executions: number;
    apiCalls: number;
    peakJobCount: number;
    peakApiKeyCount: number;
  };
  todayActivity: {
    jobsCreated: number;
    jobsDeleted: number;
    apiKeysCreated: number;
    apiKeysDeleted: number;
  };
}

// client.ts
class ReCoronClient {
  private baseUrl: string;
  private apiToken: string;

  constructor(baseUrl: string, apiToken: string) {
    this.baseUrl = baseUrl;
    this.apiToken = apiToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  }

  async getJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs');
  }

  async createJob(jobData: CreateJobRequest): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async createJobsBatch(jobsData: CreateJobRequest[]): Promise<{ count: number; jobs: Job[] }> {
    return this.request<{ count: number; jobs: Job[] }>('/jobs/batch', {
      method: 'POST',
      body: JSON.stringify(jobsData),
    });
  }

  async executeJob(jobId: string): Promise<any> {
    return this.request(`/jobs/${jobId}/execute`, {
      method: 'POST',
    });
  }

  async deleteJob(jobId: string): Promise<void> {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getUsage(): Promise<Usage> {
    return this.request<Usage>('/usage');
  }
}
// 使用例
const client = new ReCoronClient(
  'https://your-domain.com/api',
  process.env.RECORON_API_TOKEN!
);

async function main() {
  const jobs = await client.getJobs();
  console.log('Jobs:', jobs);

  const newJob = await client.createJob({
    name: 'Daily Report',
    url: 'https://api.example.com/report',
    method: 'POST',
    schedule: '0 9 * * *',
  });
  console.log('Created:', newJob);

  // 使用量を確認
  const usage = await client.getUsage();
  console.log('Monthly executions:', usage.monthly.executions);
  console.log('Daily API calls:', usage.daily.apiCalls);
  console.log('Current jobs:', usage.current.jobs);
}
```

---

## エラーハンドリング

### JavaScript/TypeScript

```javascript
async function safeApiCall() {
  try {
    const jobs = await getJobs();
    return jobs;
  } catch (error) {
    if (error.message.includes('認証')) {
      console.error('認証エラー: APIトークンを確認してください');
    } else if (error.message.includes('上限')) {
      console.error('プラン上限エラー: プランをアップグレードしてください');
    } else {
      console.error('APIエラー:', error.message);
    }
    throw error;
  }
}
```

### Python

```python
def safe_api_call():
    try:
        jobs = get_jobs()
        return jobs
    except Exception as e:
        error_message = str(e)
        if '認証' in error_message:
            print('認証エラー: APIトークンを確認してください')
        elif '上限' in error_message:
            print('プラン上限エラー: プランをアップグレードしてください')
        else:
            print(f'APIエラー: {error_message}')
        raise
```
