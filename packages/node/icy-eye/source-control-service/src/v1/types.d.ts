declare namespace SourceControlService {
  namespace Responses {
    /**
         * Error response schema.
         */
    export interface BadRequest {
      /**
             * Error code indicating the type of failure.
             */
      code: '0';
      /**
             * Additional information about the error, if available.
             */
      details?: any;
      /**
             * HTTP status code associated with the error.
             */
      status: 400;
    }
    /**
         * Error response schema.
         */
    export interface InternalServerError {
      /**
             * Error code indicating the type of failure.
             */
      code: '0';
      /**
             * Additional information about the error, if available.
             */
      details?: any;
      /**
             * HTTP status code associated with the error.
             */
      status: 500;
    }
    export interface RepositoryArrayResponse {
      data: Schemas.SourceCodeRepository[];
    }
  }
  namespace Schemas {
    /**
         * Error response schema.
         */
    export interface Error {
      /**
             * Error code indicating the type of failure.
             */
      code: string;
      /**
             * Additional information about the error, if available.
             */
      details?: any;
      /**
             * HTTP status code associated with the error.
             */
      status: number;
    }
    /**
         * A Git source code repository.
         */
    export interface GitRepository {
      id: string;
      repositoryType: 'git';
      /**
             * URL for this repository.
             */
      url: string;
    }
    export type SourceCodeRepository = /* A Git source code repository. */ GitRepository;
  }
}
declare namespace Paths {
  namespace GetRepositories {
    export type RequestBody = any;
    namespace Responses {
      export type $200 = SourceControlService.Responses.RepositoryArrayResponse;
      export type $400 = /* Error response schema. */ SourceControlService.Responses.BadRequest;
      export type $500 = /* Error response schema. */ SourceControlService.Responses.InternalServerError;
    }
  }
}
