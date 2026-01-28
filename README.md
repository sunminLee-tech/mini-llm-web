본 프로젝트의 Web UI는 LLM 기반 챗봇 기능을 사용자에게 제공하기 위한 단순하고 직관적인 인터페이스를 목표로 한다.

주요 역할

- 사용자 메시지 입력 수집
- Backend API 호출을 통한 응답 요청
- LLM 응답 결과 렌더링
- 클라이언트 식별자 관리(client_id)

동작흐름
화면1(Chatbot)

1. 사용자가 Web 화면에서 메시지를 입력한다.
2. 입력 데이터와 client_id를 Backend API로 전달한다.
3. Backend에서 LLM 호출 및 필요 시 MCP / RAG 처리를 수행한다.
4. 처리 결과를 Web UI에 출력한다.

화면2(Gallery)

1. 화면 접속 시 업로드된 이미지 목록을 조회한다.
2. 이미지 업로드 또는 삭제 요청을 Backend API로 전달한다.
3. Backend는 업로드 시 AWS S3에 이미지를 저장하고, 이미지 경로 정보를 RDB에 저장한다.
4. 삭제 요청 시 AWS S3에서 이미지를 삭제하고, 관련 메타데이터를 RDB에서 제거한다.

클라인언트 식별 방식

- 로그인 없이 사용자를 구분하기 위해 최초 접속 시 client_id를 생성한다.
- 생성된 client_id 는 브라우저 저장소에(localStorage) 저장된다.
- 이후 화면1(Chatbot)과 관련된 API를 요청 시 해당 식별자를 함께 전달한다.

보안 고려사항

- OpenAI API Key는 Frontend에 노출하지 않으면 Backend 에서만 관리한다.
- Web은 LLM API를 직접 호출하지 않고 Backend 를 통해서만 접근한다.

기술 스택

- Framework: Vue 3/ Vite
- API 통신: REST API(fetch)
