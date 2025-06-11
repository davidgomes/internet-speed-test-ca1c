
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import type { CreateSpeedTestInput } from '../../server/src/schema';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<CreateSpeedTestInput>({
    download_speed: 0,
    upload_speed: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await trpc.createSpeedTest.mutate(formData);
      setMessage({
        type: 'success',
        text: `🎉 Speed test recorded! Download: ${response.download_speed} Mbps, Upload: ${response.upload_speed} Mbps`
      });
      
      // Reset form
      setFormData({
        download_speed: 0,
        upload_speed: 0
      });
    } catch (error) {
      console.error('Failed to create speed test:', error);
      setMessage({
        type: 'error',
        text: '❌ Failed to record speed test. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Speed Test Recorder
          </h1>
          <p className="text-lg text-gray-600">
            Record your internet speed test results
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">
              📊 New Speed Test
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your download and upload speeds in Mbps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="download" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📥 Download Speed (Mbps)
                </label>
                <Input
                  id="download"
                  type="number"
                  placeholder="Enter download speed"
                  value={formData.download_speed || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateSpeedTestInput) => ({ 
                      ...prev, 
                      download_speed: parseFloat(e.target.value) || 0 
                    }))
                  }
                  step="0.01"
                  min="0"
                  required
                  className="text-lg h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="upload" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📤 Upload Speed (Mbps)
                </label>
                <Input
                  id="upload"
                  type="number"
                  placeholder="Enter upload speed"
                  value={formData.upload_speed || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateSpeedTestInput) => ({ 
                      ...prev, 
                      upload_speed: parseFloat(e.target.value) || 0 
                    }))
                  }
                  step="0.01"
                  min="0"
                  required
                  className="text-lg h-12"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || formData.download_speed <= 0 || formData.upload_speed <= 0}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Recording...
                  </span>
                ) : (
                  '💾 Record Speed Test'
                )}
              </Button>
            </form>

            {message && (
              <Alert className={`mt-6 border-0 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                <AlertDescription className="text-sm font-medium">
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>📈 Keep track of your internet performance over time</p>
        </div>
      </div>
    </div>
  );
}

export default App;
