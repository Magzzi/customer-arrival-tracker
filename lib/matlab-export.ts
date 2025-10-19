import { TimeEntry } from '@/types/time-tracking';

export function exportToMatlab(entries: TimeEntry[]) {
  if (entries.length === 0) return;
  
  // Get the first arrival time as the reference point (time 0)
  const baseTime = entries[0].arrival;
  
  // Prepare data arrays with relative time in seconds
  const matlabData = entries.map((entry, index) => {
    const arrivalSeconds = (entry.arrival - baseTime) / 1000;
    const startSeconds = entry.start ? (entry.start - baseTime) / 1000 : null;
    const endSeconds = entry.end ? (entry.end - baseTime) / 1000 : null;

    return {
      index: index + 1,
      arrivalSeconds,
      startSeconds,
      endSeconds,
    };
  });

  // Generate MATLAB script
  const matlabScript = `% --- Customer Service System Analysis ---
% Generated on ${new Date().toLocaleString()}
% All times are in SECONDS relative to the first customer arrival (t=0)
clc; clear;

% Hardcoded data from Time Tracking System
% Customer Data: All times in seconds from first arrival

% Number of customers
n = ${entries.length};

% Time data in seconds (relative to first arrival at t=0)
arrival = [${matlabData.map(d => d.arrivalSeconds.toFixed(2)).join('; ')}];
start = [${matlabData.map(d => d.startSeconds !== null ? d.startSeconds.toFixed(2) : 'NaN').join('; ')}];
finish = [${matlabData.map(d => d.endSeconds !== null ? d.endSeconds.toFixed(2) : 'NaN').join('; ')}];

% Compute system metrics
service_time = finish - start;
inter_arrival = [0; diff(arrival)];
wait_time = start - arrival;
total_time = finish - arrival;

% Display Results
fprintf('Customer Service System Data (Times in seconds from t=0):\\n');
fprintf('=============================================================================\\n');
fprintf('Customer\\tArrival(s)\\tStart(s)\\tEnd(s)\\t\\tWait(s)\\t\\tService(s)\\tTotal(s)\\n');
fprintf('=============================================================================\\n');
for i = 1:n
    if isnan(start(i))
        fprintf('%d\\t\\t%.2f\\t\\t--\\t\\t--\\t\\t--\\t\\t--\\t\\t--\\n', i, arrival(i));
    elseif isnan(finish(i))
        fprintf('%d\\t\\t%.2f\\t\\t%.2f\\t\\t--\\t\\t%.2f\\t\\t--\\t\\t--\\n', ...
            i, arrival(i), start(i), wait_time(i));
    else
        fprintf('%d\\t\\t%.2f\\t\\t%.2f\\t\\t%.2f\\t\\t%.2f\\t\\t%.2f\\t\\t%.2f\\n', ...
            i, arrival(i), start(i), finish(i), wait_time(i), service_time(i), total_time(i));
    end
end

% --- Statistical Analysis ---
% Filter out incomplete entries (NaN values)
valid_idx = ~isnan(service_time);
valid_service = service_time(valid_idx);
valid_wait = wait_time(valid_idx);
valid_total = total_time(valid_idx);

fprintf('\\n--- Analysis of the Customer Service System ---\\n');
fprintf('================================================\\n');

if sum(valid_idx) > 0
    avg_time_system = mean(valid_total);
    avg_waiting_time = mean(valid_wait);
    avg_service_time = mean(valid_service);
    prob_wait = sum(valid_wait > 0) / length(valid_wait);
    
    % Calculate utilization (ratio of total service time to total elapsed time)
    if finish(end) > arrival(1)
        utilization = sum(valid_service) / (finish(end) - arrival(1));
    else
        utilization = 0;
    end
    
    max_wait = max(valid_wait);
    min_wait = min(valid_wait);
    total_service_time = sum(valid_service);
    
    fprintf('Total Customers Processed: %d\\n', sum(valid_idx));
    fprintf('Average Time in System: %.3f sec (%.2f min)\\n', avg_time_system, avg_time_system/60);
    fprintf('Average Waiting Time: %.3f sec (%.2f min)\\n', avg_waiting_time, avg_waiting_time/60);
    fprintf('Average Service Time: %.3f sec (%.2f min)\\n', avg_service_time, avg_service_time/60);
    fprintf('Probability of Waiting: %.2f (%.1f%%)\\n', prob_wait, prob_wait*100);
    fprintf('Server Utilization: %.4f (%.2f%%)\\n', utilization, utilization*100);
    fprintf('Maximum Waiting Time: %.2f sec (%.2f min)\\n', max_wait, max_wait/60);
    fprintf('Minimum Waiting Time: %.2f sec\\n', min_wait);
    fprintf('Total Service Time: %.2f sec (%.2f min)\\n', total_service_time, total_service_time/60);
    
    % --- Visualization ---
    figure('Name', 'Customer Service System Analysis', 'NumberTitle', 'off');
    
    % Plot 1: Wait Time per Customer
    subplot(2, 2, 1);
    bar(find(valid_idx), valid_wait);
    xlabel('Customer Number');
    ylabel('Wait Time (seconds)');
    title('Wait Time per Customer');
    grid on;
    
    % Plot 2: Service Time per Customer
    subplot(2, 2, 2);
    bar(find(valid_idx), valid_service);
    xlabel('Customer Number');
    ylabel('Service Time (seconds)');
    title('Service Time per Customer');
    grid on;
    
    % Plot 3: Total Time in System
    subplot(2, 2, 3);
    bar(find(valid_idx), valid_total);
    xlabel('Customer Number');
    ylabel('Total Time (seconds)');
    title('Total Time in System per Customer');
    grid on;
    
    % Plot 4: Timeline of Activities
    subplot(2, 2, 4);
    hold on;
    for i = find(valid_idx)'
        % Arrival to Start (waiting)
        plot([arrival(i), start(i)], [i, i], 'r-', 'LineWidth', 3);
        % Start to Finish (service)
        plot([start(i), finish(i)], [i, i], 'g-', 'LineWidth', 3);
    end
    xlabel('Time (seconds)');
    ylabel('Customer Number');
    title('Customer Timeline (Red=Wait, Green=Service)');
    legend('Waiting', 'Service');
    grid on;
    hold off;
    
else
    fprintf('No complete customer records found.\\n');
end

fprintf('================================================\\n');
fprintf('Analysis complete.\\n');

% --- Helper Function ---
function secs = timeToSeconds_helper(h, m, s)
    % Converts time components to total seconds
    secs = h*3600 + m*60 + s;
end
`;

  // Create and download the file
  const blob = new Blob([matlabScript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `customer_service_analysis_${new Date().toISOString().split('T')[0]}.m`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
