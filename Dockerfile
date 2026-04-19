# Production stage - serve static files with Nginx
FROM nginx:1.25-alpine

# Set timezone
RUN apk --no-cache add tzdata
ENV TZ=Asia/Jakarta

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files to nginx html directory
COPY public/ /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
