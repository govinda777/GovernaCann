const { runAgent } = require('../../utils/agent-bridge');
const child_process = require('child_process');

jest.mock('child_process');

describe('agent-bridge', () => {
  let mockSpawn;

  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();

    mockSpawn = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn(),
      kill: jest.fn(),
    };

    child_process.spawn.mockReturnValue(mockSpawn);
  });

  it('should resolve with parsed JSON on success', async () => {
    const mockOutput = { success: true, data: 'test' };

    // Simulate spawn successfully executing
    mockSpawn.on.mockImplementation((event, callback) => {
      if (event === 'close') {
        // Defer to allow data handlers to run
        setTimeout(() => callback(0), 10);
      }
    });

    mockSpawn.stdout.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        callback(JSON.stringify(mockOutput));
      }
    });

    const result = await runAgent('test-agent', { input: 'data' });
    expect(result).toEqual(mockOutput);
    expect(child_process.spawn).toHaveBeenCalledWith('python3', expect.any(Array));
  });

  it('should resolve with raw data if JSON parsing fails', async () => {
    const rawOutput = 'Not a JSON string';

    // Simulate spawn successfully executing
    mockSpawn.on.mockImplementation((event, callback) => {
      if (event === 'close') {
        setTimeout(() => callback(0), 10);
      }
    });

    mockSpawn.stdout.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        callback(rawOutput);
      }
    });

    const result = await runAgent('test-agent', { input: 'data' });
    expect(result).toEqual({ raw: rawOutput });
  });

  it('should reject if process exits with non-zero code', async () => {
    const errorOutput = 'Some error occurred';

    mockSpawn.on.mockImplementation((event, callback) => {
      if (event === 'close') {
        setTimeout(() => callback(1), 10);
      }
    });

    mockSpawn.stderr.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        callback(errorOutput);
      }
    });

    await expect(runAgent('test-agent', { input: 'data' })).rejects.toThrow(errorOutput);
  });

  it('should reject and kill process on timeout', async () => {
    // Don't call close so it times out
    mockSpawn.on.mockImplementation((event, callback) => {
      // Do nothing to simulate long process
    });

    // Run with 100ms timeout
    const runPromise = runAgent('test-agent', { input: 'data' }, 100);

    await expect(runPromise).rejects.toThrow('Agent test-agent timed out after 100ms');
    expect(mockSpawn.kill).toHaveBeenCalledWith('SIGTERM');
  });

  it('should reject if spawn throws an error', async () => {
    mockSpawn.on.mockImplementation((event, callback) => {
      if (event === 'error') {
        setTimeout(() => callback(new Error('Spawn error')), 10);
      }
    });

    await expect(runAgent('test-agent', { input: 'data' })).rejects.toThrow('Failed to start Agent test-agent: Spawn error');
  });
});
