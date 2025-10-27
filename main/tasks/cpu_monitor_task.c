#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_timer.h"
#include <stdlib.h>
#include <string.h>
#include <ctype.h>  // Include ctype.h for isdigit

static const char *TAG = "cpu_monitor";

void split_and_print_percent_array(const char *stats_str) {
    // Make a copy of the stats_str to avoid modifying the original string
    char *str_copy = strdup(stats_str);
    if (str_copy == NULL) {
        ESP_LOGE(TAG, "Failed to allocate memory for string copy");
        return;
    }

    // Tokenize the string by '%' character
    char *token = strtok(str_copy, "%");

    // Iterate over each token and print it with a trailing "%" unless it's just "%".
    while (token != NULL) {
        // Check if the token is not empty (in case of a trailing '%' at the end)
        if (strlen(token) > 0) {
            ESP_LOGI(TAG, "%s%%", token);  // Log each token with a "%" after it
        }
        token = strtok(NULL, "%");  // Get the next token
    }

    // Clean up
    free(str_copy);
}


void cpu_monitor_task(void *pvParameters)
{
    const TickType_t delay = pdMS_TO_TICKS(5000); // log every 5s
    char *stats_buffer = malloc(2048); // Increase buffer size for larger stats

    if (!stats_buffer) {
        ESP_LOGE(TAG, "Failed to allocate stats buffer");
        vTaskDelete(NULL);
        return;
    }

    while (1) {
        vTaskGetRunTimeStats(stats_buffer);

        // Debug: Print the raw stats to check what's being returned
        ESP_LOGI(TAG, "----------------- CPU Monitor  --------------------");

        // Now format and log the stats
        split_and_print_percent_array(stats_buffer);
        ESP_LOGI(TAG, "-------------------------------------");

        vTaskDelay(delay);
    }

    // Not reached, but good practice:
    free(stats_buffer);
}
