import 'swagger-ui-react/swagger-ui.css';

import SwaggerUI from 'swagger-ui-react';

export default function OpenApiDocumentation() {
  return <SwaggerUI url="/openapi.yaml" />;
}
