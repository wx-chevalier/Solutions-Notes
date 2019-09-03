# Filter | 过滤器

```java
@Component
public class XClacksOverhead implements Filter {
    public static final String X_CLACKS_OVERHEAD = "X-Clacks-Overhead";

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
    FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        response.setHeader(X_CLACKS_OVERHEAD, "GNU Terry Pratchett");
        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {}

    @Override
    public void init(FilterConfig arg0) throws ServletException {}

}
```
