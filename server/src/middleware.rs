use actix_http::Error;
use actix_web::body::Body;
use actix_web::dev::{Service, ServiceRequest, ServiceResponse};
use actix_web::http::{header, HeaderValue};
use core::future::Future;

/// Sets cache-control header to max-age=31536000.
/// Required for all assets in build/static/ folder.
///
/// Recomended by React devs see:
///     https://create-react-app.dev/docs/production-build/#static-file-caching
pub fn cache_control<S>(
    req: ServiceRequest,
    service: &mut S,
) -> impl Future<Output = Result<ServiceResponse, Error>>
where
    S: Service<Request = ServiceRequest, Response = ServiceResponse<Body>, Error = Error>,
{
    let future = service.call(req);
    async {
        let mut result = future.await?;
        result.headers_mut().insert(
            header::CACHE_CONTROL,
            HeaderValue::from_static("max-age=31536000"),
        );
        Ok(result)
    }
}
