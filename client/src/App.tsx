import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import type { CreateSpeedTestInput } from '../../server/src/schema';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentSpeedTestResults, setCurrentSpeedTestResults] = useState<{ download_speed: number; upload_speed: number } | null>(null);

  const handleStartTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate speed test by generating random numbers
      const download_speed = Math.floor(Math.random() * (200 - 50 + 1)) + 50; // 50-200 Mbps
      const upload_speed = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // 10-50 Mbps

      const testInput: CreateSpeedTestInput = {
        download_speed,
        upload_speed
      };

      // Save the speed test results to the database
      await trpc.createSpeedTest.mutate(testInput);

      // Update current results
      setCurrentSpeedTestResults({ download_speed, upload_speed });

      setMessage({
        type: 'success',
        text: `🎉 Speed test completed! Download: ${download_speed} Mbps, Upload: ${upload_speed} Mbps`
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
            🚀 Internet Speed Test
          </h1>
          <p className="text-lg text-gray-600">
            Measure your internet connection speed
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">
              📊 Speed Test
            </CardTitle>
            <CardDescription className="text-gray-600">
              Click the button below to start measuring your connection speed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartTest} className="space-y-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Testing...
                  </span>
                ) : (
                  '🏃‍♂️ Start Speed Test'
                )}
              </Button>
            </form>

            {currentSpeedTestResults && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  📈 Test Results
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {currentSpeedTestResults.download_speed}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      📥 Download (Mbps)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {currentSpeedTestResults.upload_speed}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      📤 Upload (Mbps)
                    </div>
                  </div>
                </div>
              </div>
            )}

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
          <p>📈 Test your internet speed with a single click</p>
        </div>
      </div>
    </div>
  );
}

export default App;